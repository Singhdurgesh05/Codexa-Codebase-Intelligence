# this is to skip certain dir under the repo

import os


IGNORE_DIRS = {".git","node_modules","dist","build",".next","venv"}

def load_repository(repo_path):
    files = []
  #traverse the repo and read the content of each file
    for root, dirs, filenames in os.walk(repo_path):

        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in filenames:
            if file.endswith((".py",".js",".ts",".java",".cpp")):

                path = os.path.join(root,file)

                with open(path,"r",encoding="utf-8",errors="ignore") as f:
                    content = f.read()

                files.append({
                    "file_path": path,
                    "content": content
                })

    return files