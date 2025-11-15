<#
Start Chrome with remote debugging enabled (port 9222) using a temporary profile.
This is useful so VS Code can attach with the `Attach to Chrome` config.
#>
$chromePaths = @("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe")
$chrome = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { Write-Error "Chrome not found at expected locations."; exit 1 }
$profile = Join-Path $env:TEMP 'chrome-debug-profile'
if (-not (Test-Path $profile)) { New-Item -Path $profile -ItemType Directory | Out-Null }

Start-Process -FilePath $chrome -ArgumentList @('--remote-debugging-port=9222', "--user-data-dir=$profile", 'http://localhost:8080/Flipkart/index.html') -WindowStyle Normal
Write-Output "Started Chrome with remote debugging on 9222 (profile: $profile)"
