import argparse
import ast
from pathlib import Path
from typing import Iterable, List, Tuple

from embeddings.embedder import generate_embedding
from vector_db.qdrant_store import create_collection, store_embedding
import os


from parser.code_parser import extract_functions

def _iter_code_files(root: Path) -> Iterable[Path]:
    extensions = {".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".cpp", ".cc", ".cxx", ".hpp", ".h", ".c", ".rs", ".go"}
    for p in root.rglob("*"):
        if p.suffix.lower() not in extensions:
            continue
        parts = {part.lower() for part in p.parts}
        if ".venv" in parts or "venv" in parts or "__pycache__" in parts or "node_modules" in parts:
            continue
        if "site-packages" in parts:
            continue
        yield p


def _extract_chunks(source: str, file_path: str) -> List[Tuple[str, str]]:
    """
    Return a list of (symbol_name, code_chunk) utilizing universal Tree-Sitter extractor.
    """
    try:
        funcs = extract_functions(source, file_path)
    except Exception:
        funcs = []
        
    chunks = []
    
    # ALWAYS append the top of the file for global variables/imports
    chunks.append(("global_context", source[:2000]))

    for f in funcs:
        chunks.append((f["name"], f["code"]))
        
    if not chunks:
        chunks.append(("file_content", source.strip()[:1500] + "\n"))
        
    return chunks


def index_repo(repo_path: Path, collection: str) -> int:
    create_collection(collection)

    next_id = 1
    for file_path in _iter_code_files(repo_path):
        try:
            source = file_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            source = file_path.read_text(encoding="utf-8", errors="ignore")

        rel_path = str(file_path.relative_to(repo_path)).replace("\\", "/")
        for symbol, chunk in _extract_chunks(source, rel_path):
            emb = generate_embedding(chunk)
            store_embedding(
                id=next_id,
                embedding=emb,
                code=chunk,
                file_path=rel_path,
                function_name=symbol,
                collection_name=collection,
            )
            next_id += 1

    return next_id - 1


def main():
    parser = argparse.ArgumentParser(description="Index a repo into Qdrant for QA retrieval.")
    parser.add_argument("repo", help="Path to a local repo root (cloned GitHub repo).")
    parser.add_argument(
        "--collection",
        default=None,
        help="Qdrant collection name (defaults to env QDRANT_COLLECTION or 'codebase_analyzer')",
    )
    args = parser.parse_args()

    repo_path = Path(args.repo).resolve()
    if not repo_path.exists():
        raise SystemExit(f"Repo path does not exist: {repo_path}")

    collection = args.collection or os.getenv("QDRANT_COLLECTION", "codebase_analyzer")
    count = index_repo(repo_path, collection)
    print(f"Indexed {count} chunks into collection '{collection}'.")


if __name__ == "__main__":
    main()

