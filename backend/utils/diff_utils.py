import difflib 



def generate_diff(old_code, new_code):

    diff = difflib.unified_diff(
        old_code.splitlines(),
        new_code.splitlines(),
        lineterm=""
    )

    return "\n".join(diff)