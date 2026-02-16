#!/usr/bin/env python3
import shutil, subprocess, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

print("Clearing .next cache...")
shutil.rmtree(".next", ignore_errors=True)

print("Rebuilding...")
subprocess.run(["npm", "run", "build"])
