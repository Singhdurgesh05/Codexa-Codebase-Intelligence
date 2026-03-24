from services.llm_service import ask_llm
def prepare_repo_data(functions):
    files = set()
    function_names = []

    for f in functions:
        files.add(f["file_path"])
        if f["name"]:
            function_names.append(f["name"])

    return list(files), function_names



def generate_summary(functions):

    files, function_names = prepare_repo_data(functions)

    sample_code = "\n\n".join([f["code"] for f in functions[:5]])

    prompt = f"""
    Analyze this repository:

    Files:
    {files[:20]}

    Functions:
    {function_names[:30]}

    Sample Code:
    {sample_code}

    Generate:
    - Overview
    - Main modules
    - Architecture
    """

    return ask_llm(prompt)