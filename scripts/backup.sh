#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_FILE="/root/.openclaw/backups/openclaw_backup_${DATE}.tar.gz"

# Create backups directory
mkdir -p /root/.openclaw/backups

# Create backup
tar -czf "$BACKUP_FILE" \
  /root/.openclaw/openclaw.json \
  /root/.openclaw/cron/jobs.json \
  /root/.openclaw/scripts/ \
  /root/.openclaw/data/ \
  2>/dev/null

echo "$BACKUP_FILE"
