# yeet: Stage, commit, and push everything with one command.
param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

Write-Host "Yeeting changes..." -ForegroundColor Cyan

# Check status
Write-Host "`nStatus:" -ForegroundColor Magenta
git status --short

# Show diff summary
Write-Host "`nDiff Summary:" -ForegroundColor Magenta
git diff --stat

# Confirm
$confirm = Read-Host "`nCommit all changes with message '$Message' and push? [Y/n]"
if ($confirm -and $confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Yeet aborted." -ForegroundColor Magenta
    exit 0
}

# Execute
git add .
git commit -m $Message
git push

Write-Host "`nSuccessfully yeeted to origin!" -ForegroundColor Green
