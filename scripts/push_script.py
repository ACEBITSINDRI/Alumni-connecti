import os
import shutil

os.chdir('d:\\Alumni-connect')

# Check if merge is in progress
if os.path.exists('.git\\MERGE_HEAD'):
    print("Merge in progress, aborting...")
    os.system('git merge --abort')
    print("Merge aborted")

# Now push
print("Fetching...")
os.system('git fetch origin')
print("Rebasing...")
os.system('git rebase origin/main')
print("Pushing...")
result = os.system('git push origin main')
print(f"Push result: {result}")
