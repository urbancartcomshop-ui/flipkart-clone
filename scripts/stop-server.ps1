<#
Stops the Python fallback server previously started with `start-server.ps1`.
It uses .server_pid if present; otherwise attempts to stop processes listening on port 8080.
#>
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $root '.server_pid'
if (Test-Path $pidFile) {
    $pid = Get-Content $pidFile | Select-Object -First 1
    try { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue; Write-Output "Stopped process $pid" } catch { Write-Warning "Failed to stop $pid" }
    Remove-Item $pidFile -ErrorAction SilentlyContinue
} else {
    # Try to detect pid from netstat
    $line = netstat -aon | Select-String ":8080" | Select-Object -First 1
    if ($line) {
        $parts = ($line -split '\s+')
        $pid = $parts[-1]
        try { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue; Write-Output "Stopped process $pid" } catch { Write-Warning "Failed to stop $pid" }
    } else {
        Write-Output "No server PID file and no process found listening on port 8080."
    }
}
