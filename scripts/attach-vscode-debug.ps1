<#
Open VS Code (if not open) and programmatically show Debug view and start the active debug configuration.
This attempts to start the `Attach to Chrome` configuration.
#>
Start-Process code -ArgumentList '--command','workbench.view.debug'
Start-Sleep -Milliseconds 600
Start-Process code -ArgumentList '--command','workbench.action.debug.start'
Write-Output "Requested VS Code to start debugging."
