# chore: Quick commit and push for chores/small changes.
param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

$msg = "chore: $Message"
Write-Host "Cleaning up with chore: $msg..." -ForegroundColor Blue
git add .
git commit -m $msg
git push
Write-Host "Chore complete." -ForegroundColor Green
