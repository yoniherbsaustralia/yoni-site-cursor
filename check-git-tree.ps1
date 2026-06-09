# check-git-tree.ps1
# Helper script to check the status of the local repository against the remote tracking branch

$gitPath = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $gitPath)) {
    $gitPath = "git" # Fallback to path lookup
}

Write-Host "Fetching latest updates from remote origin..." -ForegroundColor Cyan
& $gitPath fetch origin

# Get the current branch name
$branch = & $gitPath rev-parse --abbrev-ref HEAD
Write-Host "Current local branch: $branch" -ForegroundColor Green

# Check if there's a remote tracking branch
$tracking = & $gitPath rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null

if ($null -ne $tracking) {
    Write-Host "Tracking remote branch: $tracking" -ForegroundColor Green
    
    # Check if local is behind remote
    $behindCount = [int](& $gitPath rev-list --count HEAD..$tracking).Trim()
    $aheadCount = [int](& $gitPath rev-list --count $tracking..HEAD).Trim()
    
    if ($behindCount -gt 0) {
        Write-Host "WARNING: Your local branch '$branch' is behind '$tracking' by $behindCount commit(s)." -ForegroundColor Yellow
        Write-Host "You should run: git pull" -ForegroundColor Yellow
        
        Write-Host "`nIncoming Commits:" -ForegroundColor Cyan
        & $gitPath log HEAD..$tracking --oneline
    } else {
        Write-Host "Local branch is up-to-date with remote." -ForegroundColor Green
    }
    
    if ($aheadCount -gt 0) {
        Write-Host "Your local branch is ahead of '$tracking' by $aheadCount commit(s)." -ForegroundColor Green
    }
} else {
    Write-Host "No remote tracking branch set for '$branch'. Comparing with 'origin/main'..." -ForegroundColor Yellow
    
    $behindMain = [int](& $gitPath rev-list --count HEAD..origin/main).Trim()
    if ($behindMain -gt 0) {
        Write-Host "WARNING: Your branch is behind 'origin/main' by $behindMain commit(s)." -ForegroundColor Yellow
        Write-Host "You should run: git pull origin main" -ForegroundColor Yellow
        
        Write-Host "`nIncoming Commits from origin/main:" -ForegroundColor Cyan
        & $gitPath log HEAD..origin/main --oneline
    } else {
        Write-Host "Your branch is up-to-date with 'origin/main'." -ForegroundColor Green
    }
}

# Run git status check
Write-Host "`n--- Git Status ---" -ForegroundColor Cyan
& $gitPath status
