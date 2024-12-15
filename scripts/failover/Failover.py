import requests
import time
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import paramiko

# Load configuration from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "../..", ".env"), verbose=True)

# Configuration
PRIMARY_URL = os.getenv("URL", "http://primary-server-url.com")
CHECK_INTERVAL = int(os.getenv("CHECK_INTERVAL", 10))  # seconds
KNOWN_URL = os.getenv("KNOWN_URL", "https://www.google.com")
EMAIL_CONFIG = {
    "smtp_server": os.getenv("SMTP_SERVER", "smtp.example.com"),
    "smtp_port": int(os.getenv("SMTP_PORT", 587)),
    "username": os.getenv("SMTP_USERNAME", "your-email@example.com"),
    "password": os.getenv("SMTP_PASSWORD", "your-password"),
    "from_addr": os.getenv("EMAIL_FROM", "your-email@example.com"),
    "to_addr": os.getenv("EMAIL_TO", "recipient@example.com"),
}
START_BACKUP_COMMAND = os.getenv("START_BACKUP_COMMAND", "pm2 start backup-app")
FAIL_THRESHOLD = int(os.getenv("FAIL_THRESHOLD", 3))  # Number of consecutive failures before considering a server down
BACKUP_SSH_CONFIG = {
    "hostname": os.getenv("BACKUP_SSH_HOST", "backup-server-hostname"),
    "port": int(os.getenv("BACKUP_SSH_PORT", 22)),
    "username": os.getenv("BACKUP_SSH_USER", "your-username"),
    "key_filename": os.getenv("BACKUP_SSH_KEY", "~/.ssh/id_rsa"),
}


def send_email(subject, message):
    """Send an email notification."""
    try:
        msg = MIMEText(message)
        msg["Subject"] = subject
        msg["From"] = EMAIL_CONFIG["from_addr"]
        msg["To"] = EMAIL_CONFIG["to_addr"]

        with smtplib.SMTP(EMAIL_CONFIG["smtp_server"], EMAIL_CONFIG["smtp_port"]) as server:
            # server.starttls() # Enables TLS for secure communication
            # server.login(EMAIL_CONFIG["username"], EMAIL_CONFIG["password"])
            server.sendmail(EMAIL_CONFIG["from_addr"], EMAIL_CONFIG["to_addr"], msg.as_string())
        print(f"Email sent: {subject,msg['From'],msg['To']}")
    except Exception as e:
        print(f"Failed to send email: {e}")


def check_server(url):
    """Check if the server is reachable via HTTP."""
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except requests.RequestException:
        return False


def is_server_down(url):
    """Check a server multiple times to confirm it is down."""
    for _ in range(FAIL_THRESHOLD):
        if check_server(url):
            return False
        time.sleep(5)  # Short delay between checks
    return True


def check_backup_ssh():
    """Check if the backup server is accessible via SSH."""
    for _ in range(FAIL_THRESHOLD):
        try:
            client = paramiko.SSHClient()
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.connect(hostname=BACKUP_SSH_CONFIG["hostname"], port=BACKUP_SSH_CONFIG["port"], username=BACKUP_SSH_CONFIG["username"], key_filename=BACKUP_SSH_CONFIG["key_filename"])
            client.close()
            print("Backup server SSH connection successful.")
            
        except Exception as e:
            print(f"Failed to connect to backup server via SSH: {e}")
            return False
        time.sleep(5)  # Short delay between checks
    return True

def main():
    global primary_server_down, backup_server_down
    primary_server_down, backup_server_down = False, False

    role = os.getenv("SERVER_ROLE", "primary")

    while True:
        if role == "primary":
            if check_backup_ssh():
                print("Backup server is reachable via SSH. Retrying...\n")
                if backup_server_down:
                    send_email("Backup Server Restored", "The backup server is now reachable.")
                    backup_server_down = False
            else:
                print("Backup server is down.\n")
                if not backup_server_down:
                    send_email("Backup Server Down", "The backup server is not reachable.\n")
                    backup_server_down = True

        elif role == "backup":
            if not is_server_down(PRIMARY_URL):
                print("Primary server is reachable. Retrying...\n")
                if primary_server_down:
                    send_email("Primary Server Restored", "The primary server is now reachable.\n")
                    primary_server_down = False
            else:
                print("Primary server is down. Checking connectivity...\n")
                if not is_server_down(KNOWN_URL):
                    print("Connectivity verified. Starting backup server...\n")
                    if not primary_server_down:
                        os.system(START_BACKUP_COMMAND)
                        send_email("Backup Server Activated", "The backup server has been activated as the primary server is down.")
                        primary_server_down = True
                        role = "primary"  # Assume the role of primary server
                else:
                    print("Connectivity issue detected. Retrying...\n")

        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()
