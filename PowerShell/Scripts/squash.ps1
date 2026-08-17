# squash: Auto-squash fixup commits against origin/main.
Write-Host "Squashing fixups into origin/main..." -ForegroundColor Magenta
git rebase -i --autosquash origin/main
Write-Host "Squash complete." -ForegroundColor Magenta
