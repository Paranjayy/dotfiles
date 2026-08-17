# sync: Fetch everything and rebase current branch.
Write-Host "Syncing with remote..." -ForegroundColor Cyan
git fetch --all --prune
git pull --rebase
Write-Host "Local branch is up to date." -ForegroundColor Green
