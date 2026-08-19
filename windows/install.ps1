#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Paranjay's Windows Dotfiles Installer
.DESCRIPTION
    One command to set up everything on Windows.
    Run as Admin: irm https://raw.githubusercontent.com/Paranjayy/dotfiles/main/windows/install.ps1 | iex
#>

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# ── Helpers ────────────────────────────────────────────────────
function Write-Step($msg) { Write-Host "`n[i] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "[✓] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[!] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[✗] $msg" -ForegroundColor Red }

$DotfilesDir = "$env:USERPROFILE\.dotfiles"

# ── Banner ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Paranjay's Dotfiles Installer (Windows)     ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan

# ── Winget ─────────────────────────────────────────────────────
Write-Step "Installing packages via winget..."

$WingetPackages = @(
    # Terminal
    "Microsoft.WindowsTerminal"
    "JanDeDobbeleer.OhMyPosh"
    "Microsoft.PowerShell"

    # Dev
    "Git.Git"
    "GitHub.cli"
    "Microsoft.VisualStudioCode"
    "Docker.DockerDesktop"

    # Runtimes
    "OpenJS.NodeJS.LTS"
    "Python.Python.3.12"
    "Rustlang.Rust.MSVC"
    "GoLang.Go"

    # CLI Tools
    "sharkdp.bat"
    "junegunn.fzf"
    "BurntSushi.ripgrep.MSVC"
    "sharkdp.fd"
    "jqlang.jq"
    "ajeetdsouza.zoxide"

    # Browsers
    "Google.Chrome"
    "Mozilla.Firefox"

    # Apps
    "Obsidian.Obsidian"
    "Spotify.Spotify"
    "1Password.1Password"

    # Utils
    "Microsoft.PowerToys"
    "voidtools.Everything"
)

foreach ($pkg in $WingetPackages) {
    Write-Host "  → $pkg" -ForegroundColor Gray
    winget install --id $pkg --accept-package-agreements --accept-source-agreements --silent 2>$null
}
Write-Ok "winget packages installed"

# ── Scoop (for extras) ────────────────────────────────────────
Write-Step "Installing Scoop + extras..."

if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
}

scoop install lazygit lazydocker neovim
Write-Ok "Scoop extras installed"

# ── NVM + Node ────────────────────────────────────────────────
Write-Step "Setting up Node.js..."
nvm install lts 2>$null
nvm use lts 2>$null
Write-Ok "Node.js LTS ready"

# ── Clone dotfiles ────────────────────────────────────────────
Write-Step "Cloning dotfiles..."
if (-not (Test-Path $DotfilesDir)) {
    git clone https://github.com/Paranjayy/dotfiles.git $DotfilesDir
} else {
    (cd $DotfilesDir; git pull)
}
Write-Ok "Dotfiles cloned to $DotfilesDir"

# ── Copy profile ──────────────────────────────────────────────
Write-Step "Setting up PowerShell profile..."
$ProfileDir = Split-Path -Parent $PROFILE
if (-not (Test-Path $ProfileDir)) { New-Item -ItemType Directory -Path $ProfileDir -Force | Out-Null }
Copy-Item "$DotfilesDir\windows\Microsoft.PowerShell_profile.ps1" $PROFILE -Force
Write-Ok "Profile installed: $PROFILE"

# ── Git config ────────────────────────────────────────────────
Write-Step "Configuring Git..."
git config --global user.name "Paranjay"
git config --global user.email "paranjayy@users.noreply.github.com"
git config --global init.defaultBranch main
git config --global pull.rebase true
Write-Ok "Git configured"

# ── Windows settings ──────────────────────────────────────────
Write-Step "Applying Windows tweaks..."
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "HideFileExt" -Value 0
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "Hidden" -Value 1
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name "AppsUseLightTheme" -Value 0
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name "SystemUsesLightTheme" -Value 0
Write-Ok "Dark mode + file extensions enabled"

# ── Done ──────────────────────────────────────────────────────
Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  All done! Restart your terminal.             " -ForegroundColor Green
Write-Host "  Run: oh-my-posh init pwsh | Invoke-Expression" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Green
