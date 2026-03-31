@echo off
set PATH=%PATH%;C:\Program Files\Git\cmd
cd /d C:\Users\andha\.gemini\antigravity\scratch\agromarket
git add .
git commit -m "Update for cloud deployment"
git push origin main
echo PUSH DONE
