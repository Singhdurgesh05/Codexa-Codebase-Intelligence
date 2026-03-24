from git import Repo
import os

def clone(repo_url):
    repo_name = repo_url.split('/')[-1].replace('.git', '')
    clone_path=f"repos/{repo_name}"
    
    if os.path.exists("repos"):
       os.makedirs("repos", exist_ok=True)

    if not os.path.exists(clone_path):
        Repo.clone_from(repo_url, clone_path)
        print(f"Cloned {repo_url} to {clone_path}")

    return clone_path

   