#Requires -Version 5.1
<#
.SYNOPSIS
    Paranjay's Windows Setup Script
.DESCRIPTION
    Sets up a fresh Windows installation with dev tools, terminal config, and dotfiles.
    Run as Administrator: irm https://raw.githubusercontent.com/Paranjayy/dotfiles/main/windows/setup.ps1 | iex
#>

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

Write-Host "`n==> Paranjay's Windows Setup" -ForegroundColor Cyan

# ── winget Packages ────────────────────────────────────────────
$Packages = @(
    # Terminals
    "Microsoft.WindowsTerminal"
    "JanDeDobbeleer.OhMyPosh"

    # Dev Tools
    "Git.Git"
    "GitHub.cli"
    "Microsoft.VisualStudioCode"
    "Microsoft.PowerShell"

    # Browsers
    "Google.Chrome"
    "Mozilla.Firefox"

    # CLI Tools
    "sharkdp.bat"
    "junegunn.fzf"
    "BurntSushi.ripgrep.MSVC"
    "sharkdp.fd"
    "jqlang.jq"
    "ajeetdsouza.zoxide"
    "junegunn.fzf"

    # Dev Runtimes
    "OpenJS.NodeJS.LTS"
    "Python.Python.3.12"
    "Rustlang.Rust.MSVC"
    "GoLang.Go"

    # Apps
    "Obsidian.Obsidian"
    "Typora.Typora"
    "Spotify.Spotify"
    "1Password.1Password"

    # Utilities
    "Microsoft.PowerToys"
    "voidtools.Everything"
    "Obsidian.Obsidian"
)

Write-Host "==> Installing packages via winget..." -ForegroundColor Yellow
foreach ($pkg in $Packages) {
    Write-Host "  Installing $pkg..." -ForegroundColor Gray
    winget install --id $pkg --accept-package-agreements --accept-source-agreements --silent 2>$null
}

# ── Scoop (fallback for packages not in winget) ────────────────
if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Write-Host "==> Installing Scoop..." -ForegroundColor Yellow
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
}

Write-Host "==> Installing scoop packages..." -ForegroundColor Yellow
scoop install lazygit lazydocker btop nvm

# ── NVM + Node ─────────────────────────────────────────────────
if (Get-Command nvm -ErrorAction SilentlyContinue) {
    Write-Host "==> Installing Node.js LTS..." -ForegroundColor Yellow
    nvm install lts
    nvm use lts
}

# ── PowerShell Profile ─────────────────────────────────────────
Write-Host "==> Setting up PowerShell profile..." -ForegroundColor Yellow
$ProfileDir = Split-Path -Parent $PROFILE
if (-not (Test-Path $ProfileDir)) { New-Item -ItemType Directory -Path $ProfileDir -Force | Out-Null }

$DotfilesDir = "$env:USERPROFILE\dotfiles"
if (Test-Path $DotfilesDir) {
    Copy-Item "$DotfilesDir\windows\Microsoft.PowerShell_profile.ps1" $PROFILE -Force
    Write-Host "  Profile copied to $PROFILE" -ForegroundColor Gray
}

# ── Git Config ─────────────────────────────────────────────────
Write-Host "==> Setting up Git..." -ForegroundColor Yellow
git config --global user.name "Paranjay"
git config --global user.email "paranjayy@users.noreply.github.com"
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global core.autocrlf input

# ── Windows Settings ───────────────────────────────────────────
Write-Host "==> Applying Windows settings..." -ForegroundColor Yellow

# Show file extensions
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "HideFileExt" -Value 0

# Show hidden files
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "Hidden" -Value 1

# Dark mode
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name "AppsUseLightTheme" -Value 0
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name "SystemUsesLightTheme" -Value 0

# ── Restart Explorer ───────────────────────────────────────────
Stop-Process -Name explorer -Force
Start-Process explorer

Write-Host "`n==> Setup complete!" -ForegroundColor Green
Write-Host "    Restart your terminal to pick up changes." -ForegroundColor Cyan
Write-Host "    Run 'oh-my-posh init pwsh' to verify Oh My Posh." -ForegroundColor Cyan
