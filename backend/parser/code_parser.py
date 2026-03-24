import os
from tree_sitter import Parser, Language

import tree_sitter_python
import tree_sitter_javascript
import tree_sitter_typescript
import tree_sitter_java
import tree_sitter_cpp
import tree_sitter_rust
import tree_sitter_go
import tree_sitter_c

LANGUAGE_MAP = {
    ".py": Language(tree_sitter_python.language()),
    ".js": Language(tree_sitter_javascript.language()),
    ".jsx": Language(tree_sitter_javascript.language()),
    ".ts": Language(tree_sitter_typescript.language_typescript()),
    ".tsx": Language(tree_sitter_typescript.language_tsx()),
    ".java": Language(tree_sitter_java.language()),
    ".cpp": Language(tree_sitter_cpp.language()),
    ".cc": Language(tree_sitter_cpp.language()),
    ".hpp": Language(tree_sitter_cpp.language()),
    ".h": Language(tree_sitter_c.language()),
    ".c": Language(tree_sitter_c.language()),
    ".rs": Language(tree_sitter_rust.language()),
    ".go": Language(tree_sitter_go.language()),
}

FUNCTION_NODE_TYPES = {
    "function_definition",    # Python, C, C++
    "function_declaration",   # JS, TS, Rust, Go, C, C++
    "method_definition",      # JS, TS, Python
    "method_declaration",     # Java, Go
    "arrow_function",         # JS, TS
    "function_item",          # Rust
}

def extract_functions(code: str, file_path: str = ""):
    """
    Extract all function/method definitions from multi-language code files.
    """
    _, ext = os.path.splitext(file_path)
    lang = LANGUAGE_MAP.get(ext.lower(), LANGUAGE_MAP[".py"]) # Default to Python if unknown but tested

    parser = Parser(lang)
    tree = parser.parse(code.encode("utf8"))
    root = tree.root_node

    lines = code.splitlines(keepends=True)
    functions = []

    def visit(node):
        if node.type in FUNCTION_NODE_TYPES:
            start_row, _ = node.start_point
            end_row, _ = node.end_point

            func_code = "".join(lines[start_row:end_row + 1])

            name = None
            for child in node.children:
                if child.type in ["identifier", "name", "property_identifier"]:
                    name = code[child.start_byte:child.end_byte]
                    break
                    
            if not name:
                for child in node.children:
                    if child.type == "function_declarator":
                        for sub in child.children:
                            if sub.type == "identifier":
                                name = code[sub.start_byte:sub.end_byte]
                                break

            if name:
                functions.append({
                    "name": name.strip(),
                    "file_path": file_path,
                    "start_line": start_row + 1,
                    "end_line": end_row + 1,
                    "code": func_code
                })

        for child in node.children:
            visit(child)

    visit(root)
    return functions