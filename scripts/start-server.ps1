<#
Starts the Python fallback server (server_py.py) in background, saves PID to .server_pid,
and opens the Flipkart index page in the default browser.
#>
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$server = Join-Path $root '..\server_py.py' | Resolve-Path -ErrorAction SilentlyContinue
if (-not $server) {
    Write-Error "server_py.py not found in project root."
    exit 1
}
$serverPath = $server.Path

# Start server in background
$p = Start-Process -FilePath python -ArgumentList $serverPath -PassThru -WindowStyle Hidden
$pidFile = Join-Path $root '.server_pid'
$p.Id | Out-File -FilePath $pidFile -Encoding ascii
Start-Sleep -Seconds 1

Start-Process "http://localhost:8080/Flipkart/index.html"
Write-Output "Started server_py.py (PID $($p.Id)). PID saved to $pidFile"
