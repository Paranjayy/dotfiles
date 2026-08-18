# Windows Dev Environment Bootstrap
# Run: irm https://raw.githubusercontent.com/Paranjayy/dotfiles/main/windows/setup.ps1 | iex
# Or: .\windows\setup.ps1

param(
    [switch]$Minimal
)

$ESC = [char]27
function Write-Step { param($msg) Write-Host "$ESC[1;36m→ $msg$ESC[0m" }
function Write-Ok { param($msg) Write-Host "$ESC[1;32m✓ $msg$ESC[0m" }
function Write-Warn { param($msg) Write-Host "$ESC[1;33m! $msg$ESC[0m" }

Write-Host ""
Write-Host "$ESC[1;35m╔══════════════════════════════════════╗$ESC[0m"
Write-Host "$ESC[1;35m║   Windows Dev Environment Setup      ║$ESC[0m"
Write-Host "$ESC[1;35m╚══════════════════════════════════════╝$ESC[0m"
Write-Host ""

# ── Scoop ──────────────────────────────────────────────────────
if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Write-Step "Installing Scoop..."
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
} else {
    Write-Ok "Scoop already installed"
}

# ── Core Tools ─────────────────────────────────────────────────
$coreTools = @(
    "git", "nodejs", "neovim", "fzf", "fd", "ripgrep",
    "bat", "eza", "zoxide", "7zip", "curl"
)

Write-Step "Installing core tools..."
foreach ($tool in $coreTools) {
    if (-not (scoop list $tool 2>$null | Select-String $tool)) {
        scoop install $tool
    } else {
        Write-Ok "$tool already installed"
    }
}

# ── Extra Tools (skip with -Minimal) ──────────────────────────
if (-not $Minimal) {
    $extraTools = @(
        "lazygit", "dust", "duf", "bottom", "starship",
        "gcc", "alacritty"
    )

    Write-Step "Installing extra tools..."
    foreach ($tool in $extraTools) {
        if (-not (scoop list $tool 2>$null | Select-String $tool)) {
            scoop install $tool
        } else {
            Write-Ok "$tool already installed"
        }
    }
}

# ── Time Sync ──────────────────────────────────────────────────
Write-Step "Configuring time sync..."
Start-Service w32time -ErrorAction SilentlyContinue
w32tm /config /manualpeerlist:"time.windows.com pool.ntp.org" /syncfromflags:manual /reliable:no /update 2>$null
w32tm /resync /force 2>$null
schtasks /create /tn "NTP_Sync" /tr "w32tm /resync /force" /sc minute /mo 30 /ru SYSTEM /rl HIGHEST /f 2>$null | Out-Null
Write-Ok "Time sync configured (every 30 min)"

# ── Git Config ─────────────────────────────────────────────────
Write-Step "Checking git config..."
$name = git config --global user.name 2>$null
$email = git config --global user.email 2>$null
if (-not $name -or -not $email) {
    Write-Warn "Git user.name or user.email not set. Set them with:"
    Write-Host "  git config --global user.name 'Your Name'"
    Write-Host "  git config --global user.email 'you@email.com'"
} else {
    Write-Ok "Git configured: $name <$email>"
}

# ── Symlink Dotfiles ──────────────────────────────────────────
Write-Step "Linking dotfiles..."
$dotfilesDir = "$env:USERPROFILE\dotfiles"

# PowerShell profile
if (Test-Path "$dotfilesDir\PowerShell\Microsoft.PowerShell_profile.ps1") {
    $profileDir = Split-Path $PROFILE
    if (-not (Test-Path $profileDir)) { New-Item -ItemType Directory -Path $profileDir -Force | Out-Null }
    Copy-Item "$dotfilesDir\PowerShell\Microsoft.PowerShell_profile.ps1" $PROFILE -Force
    Write-Ok "PowerShell profile linked"
}

# Ghostty config
if (Test-Path "$dotfilesDir\ghostty\config") {
    $ghosttyDir = "$env:APPDATA\ghostty"
    if (-not (Test-Path $ghosttyDir)) { New-Item -ItemType Directory -Path $ghosttyDir -Force | Out-Null }
    Copy-Item "$dotfilesDir\ghostty\config" "$ghosttyDir\config" -Force
    Write-Ok "Ghostty config linked"
}

# Starship config
if (Test-Path "$dotfilesDir\starship.toml") {
    Copy-Item "$dotfilesDir\starship.toml" "$env:USERPROFILE\.config\starship.toml" -Force
    Write-Ok "Starship config linked"
}

Write-Host ""
Write-Host "$ESC[1;32mSetup complete! Restart your terminal.$ESC[0m"
Write-Host ""
