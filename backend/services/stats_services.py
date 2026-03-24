def compute_stats(functions):

    total_functions = len(functions)
    files = set(f["file_path"] for f in functions)

    file_counts = {}

    for f in functions:
        file_counts[f["file_path"]] = file_counts.get(f["file_path"], 0) + 1

    largest_file = max(file_counts, key=file_counts.get)

    return {
        "total_files": len(files),
        "total_functions": total_functions,
        "largest_file": largest_file,
        "functions_per_file": file_counts
    }