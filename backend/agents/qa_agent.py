from embeddings.embedder import generate_embedding
from vector_db.qdrant_store import search_similar
from services.llm_service import ask_llm

def answer_question(query, collection_name=None):
    query_embedding = generate_embedding(query)

    if collection_name:
        results = search_similar(query_embedding, top_k=15, collection_name=collection_name)
    else:
        results = search_similar(query_embedding, top_k=15)

    if not results:
        return (
            "No relevant code found in index.\n"
            "👉 Try indexing the repo first."
        )

    snippets = []
    for r in results:
        payload = r.get("payload") or {}

        file_path = payload.get("file_path", "unknown_file")
        symbol = payload.get("function_name") or payload.get("name") or "unknown_symbol"

        code = payload.get("code", "")[:2500]  # Expanded to prevent cutting off large functions

        snippets.append(f"[{file_path}::{symbol}]\n{code}")

    context = "\n\n---\n\n".join(snippets)

    prompt = f"""
You are a senior software engineer.

Answer the question using ONLY the provided code snippets.

If the answer is not present, say:
"I could not find this in the indexed code."

Question:
{query}

Code Snippets:
{context}

Instructions:
- Be concise
- Mention file names and functions
- Do not guess

Answer format:
Answer:
<answer>

Evidence:
- [file::function]
"""

    return ask_llm(prompt)
