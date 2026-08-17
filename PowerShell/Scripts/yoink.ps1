# yoink: Pull changes with rebase.
Write-Host "Yoinking changes from origin..." -ForegroundColor Cyan
git pull --rebase
Write-Host "Yoink complete." -ForegroundColor Green
