#!/bin/bash
DATE=$(date +%Y%m%d)

# Backup directory
BACKUP_DIR="/root/.openclaw/backup-git"

# Copy latest files
cp /root/.openclaw/openclaw.json "$BACKUP_DIR/"
cp /root/.openclaw/cron/jobs.json "$BACKUP_DIR/"
cp -r /root/.openclaw/scripts "$BACKUP_DIR/"
cp -r /root/.openclaw/data "$BACKUP_DIR/"

# Commit and push
cd "$BACKUP_DIR"
git add .
git commit -m "Backup $DATE" || exit 0
git push origin main

echo "Backup pushed to GitHub: $DATE"
