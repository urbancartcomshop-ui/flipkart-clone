#!/usr/bin/env python3
"""
Custom Flipkart Clone Deployer
Deploys to any Linux server via SSH
"""

import os
import sys
import subprocess
import json
import time
from pathlib import Path

class FlipkartDeployer:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.aws_revive = self.project_root / "aws_revive"
        
    def print_banner(self):
        print("\n" + "="*60)
        print("🚀 FLIPKART CLONE - CUSTOM DEPLOYER")
        print("="*60 + "\n")
    
    def check_requirements(self):
        """Check if all required tools are available"""
        print("📋 Checking requirements...")
        requirements = {
            "git": "Git",
            "ssh": "SSH",
            "node": "Node.js",
            "npm": "NPM"
        }
        
        missing = []
        for cmd, name in requirements.items():
            try:
                subprocess.run([cmd, "--version"], capture_output=True, check=True)
                print(f"  ✅ {name}")
            except (subprocess.CalledProcessError, FileNotFoundError):
                print(f"  ❌ {name} - NOT FOUND")
                missing.append(name)
        
        if missing:
            print(f"\n⚠️  Missing: {', '.join(missing)}")
            return False
        print("\n✅ All requirements met!\n")
        return True
    
    def get_server_info(self):
        """Get server connection details from user"""
        print("📡 SERVER CONNECTION DETAILS")
        print("-" * 40)
        
        while True:
            server_ip = input("Enter server IP/hostname: ").strip()
            if server_ip:
                break
            print("❌ IP cannot be empty")
        
        while True:
            user = input("SSH user (default: ec2-user): ").strip() or "ec2-user"
            break
        
        while True:
            key_path = input("Path to SSH key (.pem file): ").strip()
            key_file = Path(key_path).expanduser()
            if key_file.exists():
                print(f"  ✅ Found key: {key_file}")
                break
            print(f"  ❌ Key not found: {key_file}")
        
        port = input("SSH port (default: 22): ").strip() or "22"
        
        return {
            "ip": server_ip,
            "user": user,
            "key": str(key_file),
            "port": port
        }
    
    def test_connection(self, server):
        """Test SSH connection"""
        print("\n🔗 Testing SSH connection...")
        try:
            cmd = [
                "ssh",
                "-i", server["key"],
                "-p", server["port"],
                "-o", "ConnectTimeout=5",
                f"{server['user']}@{server['ip']}",
                "echo 'SSH connection successful'"
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                print("  ✅ SSH connection successful!")
                return True
            else:
                print(f"  ❌ Connection failed: {result.stderr}")
                return False
        except subprocess.TimeoutExpired:
            print("  ❌ Connection timeout")
            return False
        except Exception as e:
            print(f"  ❌ Error: {e}")
            return False
    
    def execute_remote_command(self, server, command, description=""):
        """Execute command on remote server"""
        if description:
            print(f"\n{description}...")
        
        try:
            cmd = [
                "ssh",
                "-i", server["key"],
                "-p", server["port"],
                f"{server['user']}@{server['ip']}",
                command
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                if description:
                    print(f"  ✅ Complete")
                return True, result.stdout
            else:
                print(f"  ❌ Failed: {result.stderr}")
                return False, result.stderr
        except subprocess.TimeoutExpired:
            print(f"  ❌ Command timeout")
            return False, "Timeout"
        except Exception as e:
            print(f"  ❌ Error: {e}")
            return False, str(e)
    
    def deploy(self, server):
        """Deploy application to server"""
        print("\n" + "="*60)
        print("🚀 DEPLOYMENT STEPS")
        print("="*60)
        
        # Step 1: Update system
        cmd = "sudo yum update -y"
        success, _ = self.execute_remote_command(server, cmd, "📦 Updating system packages")
        if not success:
            return False
        
        # Step 2: Install dependencies
        cmd = "sudo yum install -y nodejs npm git curl wget"
        success, _ = self.execute_remote_command(server, cmd, "📦 Installing Node.js, npm, git")
        if not success:
            return False
        
        # Step 3: Create app directory
        cmd = "mkdir -p ~/flipkart-app && cd ~/flipkart-app"
        success, _ = self.execute_remote_command(server, cmd, "📁 Creating app directory")
        if not success:
            return False
        
        # Step 4: Clone repository
        cmd = "cd ~/flipkart-app && git clone https://github.com/urbancartcomshop-ui/flipkart-clone.git . || git pull"
        success, output = self.execute_remote_command(server, cmd, "📥 Cloning repository")
        if not success:
            return False
        
        # Step 5: Install npm dependencies
        cmd = "cd ~/flipkart-app/aws_revive && npm install"
        success, _ = self.execute_remote_command(server, cmd, "📚 Installing npm dependencies")
        if not success:
            return False
        
        # Step 6: Install PM2 for process management
        cmd = "sudo npm install -g pm2"
        success, _ = self.execute_remote_command(server, cmd, "⚙️  Installing PM2 (process manager)")
        if not success:
            return False
        
        # Step 7: Stop existing PM2 process if any
        cmd = "pm2 stop flipkart-server 2>/dev/null || true"
        self.execute_remote_command(server, cmd)
        
        # Step 8: Start application with PM2
        cmd = "cd ~/flipkart-app/aws_revive && pm2 start server-deploy.js --name 'flipkart-server' --instances 1 --exec-mode cluster"
        success, _ = self.execute_remote_command(server, cmd, "🚀 Starting application")
        if not success:
            return False
        
        # Step 9: Setup PM2 to restart on reboot
        cmd = "pm2 startup && pm2 save"
        success, _ = self.execute_remote_command(server, cmd, "🔄 Setting up auto-restart")
        if not success:
            return False
        
        # Step 10: Verify application is running
        time.sleep(2)
        cmd = "pm2 status"
        success, output = self.execute_remote_command(server, cmd)
        
        if success and "flipkart-server" in output:
            print("  ✅ Application is running")
        else:
            print("  ⚠️  Could not verify status")
        
        return True
    
    def get_app_url(self, server):
        """Get application URL"""
        return f"http://{server['ip']}:3000"
    
    def show_completion_info(self, server):
        """Show deployment completion information"""
        app_url = self.get_app_url(server)
        
        print("\n" + "="*60)
        print("✅ DEPLOYMENT COMPLETE!")
        print("="*60)
        print(f"\n🌐 Application URL: {app_url}")
        print(f"📱 Access from browser: {app_url}")
        print(f"\n📊 Useful Commands:")
        print(f"  • View logs: ssh -i {server['key']} {server['user']}@{server['ip']} 'pm2 logs flipkart-server'")
        print(f"  • Check status: ssh -i {server['key']} {server['user']}@{server['ip']} 'pm2 status'")
        print(f"  • Restart app: ssh -i {server['key']} {server['user']}@{server['ip']} 'pm2 restart flipkart-server'")
        print(f"\n✅ All 32 products should be visible at: {app_url}")
        print(f"✅ Products images should be loading")
        print(f"✅ Cart functionality should work")
        print("\n" + "="*60 + "\n")
    
    def run(self):
        """Main deployment flow"""
        self.print_banner()
        
        # Check requirements
        if not self.check_requirements():
            print("❌ Please install missing requirements")
            return False
        
        # Get server info
        server = self.get_server_info()
        
        # Test connection
        if not self.test_connection(server):
            print("\n❌ Cannot connect to server. Please verify:")
            print("  • Server is running")
            print("  • IP address is correct")
            print("  • SSH key is correct")
            print("  • Security group allows port 22")
            return False
        
        # Deploy
        if self.deploy(server):
            self.show_completion_info(server)
            return True
        else:
            print("\n❌ Deployment failed")
            return False

if __name__ == "__main__":
    deployer = FlipkartDeployer()
    success = deployer.run()
    sys.exit(0 if success else 1)
