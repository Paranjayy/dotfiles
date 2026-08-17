# install - cross-platform package manager wrapper
# Usage: install <package> | install git node python
function install {
    param([Parameter(ValueFromRemainingArguments=$true)][string[]]$Packages)
    if (-not $Packages) { Write-Host "Usage: install <pkg1> <pkg2> ..." -ForegroundColor Yellow; return }
    if ($IsLinux -or $env:OS -ne "Windows_NT") {
        if (Get-Command yay -ErrorAction SilentlyContinue) { yay -S $Packages }
        elseif (Get-Command pacman -ErrorAction SilentlyContinue) { sudo pacman -S --noconfirm $Packages }
        elseif (Get-Command apt -ErrorAction SilentlyContinue) { sudo apt install -y $Packages }
        else { Write-Host "No package manager found" -ForegroundColor Red }
    } else {
        if (Get-Command scoop -ErrorAction SilentlyContinue) { scoop install $Packages }
        elseif (Get-Command winget -ErrorAction SilentlyContinue) { winget install --id $Packages --accept-package-agreements --accept-source-agreements }
        elseif (Get-Command choco -ErrorAction SilentlyContinue) { choco install -y $Packages }
        else { Write-Host "No package manager found" -ForegroundColor Red }
    }
}
