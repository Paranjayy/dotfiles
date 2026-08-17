# Paranjay's PowerShell Profile (Cross-Platform)
# Works on Windows, Linux (pwsh), and macOS

# ── Oh My Posh ─────────────────────────────────────────────────
if (Get-Command oh-my-posh -ErrorAction SilentlyContinue) {
    oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\paradox.omp.json" | Invoke-Expression
}

# ── PSReadLine ─────────────────────────────────────────────────
Set-PSReadLineOption -EditMode Windows
Set-PSReadLineOption -PredictionSource HistoryAndPlugin
Set-PSReadLineOption -HistorySearchCursorMovesToEnd
Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward

# ── Cross-Platform Package Manager ─────────────────────────────
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

# ── Git Aliases ────────────────────────────────────────────────
function gs { git status @args }
function gp { git push @args }
function gpl { git pull --rebase @args }
function gl { git log --oneline -15 @args }
function gd { git diff @args }
function gco { param($b) git checkout $b @args }
function gb { git branch @args }
function gaa { git add . @args }
function gcm { param($m) git commit -m $m @args }
function gpm { git pull --rebase; git push }
function gbd { param($b) git branch -d $b @args }
function glog { git log --oneline --graph --decorate @args }

# ── Navigation ─────────────────────────────────────────────────
function .. { Set-Location .. }
function ... { Set-Location ..\.. }
function .... { Set-Location ..\..\.. }
function dl { Set-Location ~/Downloads }
function proj { Set-Location ~/Developer }
function dots { Set-Location ~/dotfiles }

# ── Linux-Style Aliases ────────────────────────────────────────
function ll {
    if (Get-Command eza -ErrorAction SilentlyContinue) {
        eza -la --icons --git @args
    } elseif ($IsLinux -or $env:OS -ne "Windows_NT") {
        Get-ChildItem -Force --color=auto
    } else {
        Get-ChildItem -Force
    }
}
function lt {
    if (Get-Command eza -ErrorAction SilentlyContinue) {
        eza --tree --icons --level=2 @args
    } else {
        tree /F /A
    }
}
function la { Get-ChildItem -Force -Hidden }
function cls { Clear-Host }
function c { Clear-Host }

# bat as cat if available
if (Get-Command bat -ErrorAction SilentlyContinue) {
    function cat { bat @args }
}

# ── Utilities ──────────────────────────────────────────────────
function mkcd { param($d) New-Item -ItemType Directory -Path $d -Force; Set-Location $d }
function Touch { param($f) New-Item -ItemType File -Path $f -Force }
function which { param($c) Get-Command $c -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source }
function ports {
    if ($IsLinux -or $env:OS -ne "Windows_NT") {
        ss -tlnp
    } else {
        netstat -ano | Select-String "LISTENING"
    }
}

# ── Environment ────────────────────────────────────────────────
$env:EDITOR = if (Get-Command nvim -ErrorAction SilentlyContinue) { "nvim" } else { "vim" }
$env:GIT_EDITOR = $env:EDITOR

# ── PATH Helper ────────────────────────────────────────────────
function Add-ToPath {
    param([string]$Dir)
    if (Test-Path $Dir -PathType Container) {
        $env:PATH = "$Dir;$env:PATH"
    }
}
$scoopShims = "$env:USERPROFILE\scoop\shims"
if (Test-Path $scoopShims) { Add-ToPath $scoopShims }

# ── FZF ────────────────────────────────────────────────────────
if (Get-Command fzf -ErrorAction SilentlyContinue) {
    Set-PSReadLineKeyHandler -Key Ctrl+r -ScriptBlock {
        $line = $null
        $cursor = $null
        [Microsoft.PowerShell.PSConsoleReadLine]::GetBufferState([ref]$line, [ref]$cursor)
        $result = fzf --tac --no-sort | ForEach-Object { $_ }
        if ($result) {
            [Microsoft.PowerShell.PSConsoleReadLine]::RevertLine()
            [Microsoft.PowerShell.PSConsoleReadLine]::Insert($result)
        }
    }
}

# ── Starship Prompt ────────────────────────────────────────────
if (Get-Command starship -ErrorAction SilentlyContinue) {
    function Invoke-Starship_transient_function {
        $ESC = [char]27
        "$ESC[1;35m❯$ESC[0m "
    }
    Enable-TransientPrompt
    function prompt { starship prompt }
}
