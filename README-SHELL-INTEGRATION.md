Shell integration and helper scripts
=================================

This project includes small PowerShell helper scripts to run the project and attach the debugger.

Location: `scripts/`

- `start-server.ps1` — starts `server_py.py` (Python fallback server) in background and opens the site.
- `stop-server.ps1` — stops the background Python server (by saved PID or port 8080 lookup).
- `start-chrome-debug.ps1` — launches Chrome with `--remote-debugging-port=9222` to allow VS Code attach.
- `attach-vscode-debug.ps1` — asks VS Code to open the Run view and start the selected debug configuration.

Quick usage (PowerShell):

1. Start server and open site:

```powershell
.\scripts\start-server.ps1
```

2. Start Chrome with remote debugging (optional if you want to attach):

```powershell
.\scripts\start-chrome-debug.ps1
```

3. Start VS Code debug attach sequence:

```powershell
.\scripts\attach-vscode-debug.ps1
```

4. Stop server:

```powershell
.\scripts\stop-server.ps1
```

Optional Explorer context-menu (requires you to run the `.reg` file as Administrator):

- `flipkart-context.reg` — adds a "Flipkart: Start Server Here" background menu item to File Explorer which executes the `start-server.ps1` script in the selected folder. Run it only if you understand adding registry entries.

Notes and limitations
- The Node/Express server is included (`server.js` + `package.json`) but your machine currently doesn't have Node/npm installed. Use Python fallback if Node is not available.
- PowerShell may block running unsigned scripts depending on ExecutionPolicy. If scripts are blocked, run PowerShell as Administrator and use:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

If you want me to add the optional Explorer registry entry automatically, tell me and I will create it (I will not apply it without your explicit approval).
