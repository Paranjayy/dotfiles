# diffme: Show what would go to main.
Write-Host "Diff against origin/main:" -ForegroundColor Cyan
git diff origin/main...HEAD --stat
