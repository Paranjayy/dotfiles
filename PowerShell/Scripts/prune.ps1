# prune: Delete local branches that have been merged into origin/main.
Write-Host "Pruning merged branches..." -ForegroundColor Cyan
git fetch --all --prune
$merged = git branch --merged origin/main | Where-Object { $_ -notmatch '^\*|main$' -and $_.Trim() -ne '' }
if ($merged) {
    $merged | ForEach-Object { git branch -d $_.Trim() }
    Write-Host "Pruning complete." -ForegroundColor Green
} else {
    Write-Host "No merged branches to prune." -ForegroundColor Yellow
}
