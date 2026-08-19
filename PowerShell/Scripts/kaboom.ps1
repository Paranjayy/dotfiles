# kaboom: Hard reset and clean everything. Nuclear option.
Write-Host "KABOOM: This will wipe all uncommitted changes and untracked files!" -ForegroundColor Red -BackgroundColor Black
$confirm = Read-Host "Are you absolutely sure? [y/N]"
if ($confirm -eq "y" -or $confirm -eq "Y") {
    Write-Host "Detonating..." -ForegroundColor Red
    git reset --hard HEAD
    git clean -fd
    Write-Host "Everything is gone." -ForegroundColor Red
} else {
    Write-Host "Whew. That was close."
}
