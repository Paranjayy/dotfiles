# vanish: Commit and push without needing a manual message.
$msg = "chore: ghost ship $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

Write-Host "Vanishing changes..." -ForegroundColor Cyan
git add .
git commit -m $msg
git push
Write-Host "Successfully vanished into origin." -ForegroundColor Green
