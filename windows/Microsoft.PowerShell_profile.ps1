# Paranjay's PowerShell Profile (Cross-Platform)
# Works on Windows, Linux (pwsh), and macOS

# Oh My Posh
if (Get-Command oh-my-posh -ErrorAction SilentlyContinue) {
    oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\paradox.omp.json" | Invoke-Expression
}

# PSReadLine
Set-PSReadLineOption -EditMode Windows
Set-PSReadLineOption -PredictionSource HistoryAndPlugin
Set-PSReadLineOption -HistorySearchCursorMovesToEnd
Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward

# Cross-Platform Package Manager
function install {
    param([Parameter(ValueFromRemainingArguments=$true)][string[]]$Packages)
    if (-not $Packages) { Write-Host "Usage: install <pkg1> <pkg2> ..." -ForegroundColor Yellow; return }
    if ($IsLinux -or $env:OS -ne "Windows_NT") {
        if (Get-Command yay -ErrorAction SilentlyContinue) { yay -S --needed $Packages }
        elseif (Get-Command pacman -ErrorAction SilentlyContinue) { sudo pacman -S --needed --noconfirm $Packages }
        elseif (Get-Command apt -ErrorAction SilentlyContinue) { sudo apt install -y $Packages }
        elseif (Get-Command dnf -ErrorAction SilentlyContinue) { sudo dnf install -y $Packages }
        else { Write-Host "No package manager found" -ForegroundColor Red }
    } else {
        if (Get-Command scoop -ErrorAction SilentlyContinue) { scoop install $Packages }
        elseif (Get-Command winget -ErrorAction SilentlyContinue) { winget install --id $Packages --accept-package-agreements --accept-source-agreements }
        elseif (Get-Command choco -ErrorAction SilentlyContinue) { choco install -y $Packages }
        else { Write-Host "No package manager found" -ForegroundColor Red }
    }
}

# Git Aliases
function gs { git status }
function gp { git push }
function gpl { git pull --rebase }
function gl { git log --oneline -15 }
function gd { git diff }
function gco { param($b) git checkout $b }
function gb { git branch }
function gaa { git add . }
function gcm { param($m) git commit -m $m }

# Navigation
function .. { Set-Location .. }
function ... { Set-Location ..\.. }

# Utilities
function mkcd { param($d) New-Item -ItemType Directory -Path $d -Force; Set-Location $d }
function which { param($c) Get-Command $c -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source }

# Environment
$env:EDITOR = if (Get-Command nvim -ErrorAction SilentlyContinue) { "nvim" } else { "vim" }
$env:GIT_EDITOR = $env:EDITOR
