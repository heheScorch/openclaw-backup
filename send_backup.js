const fs = require('fs');
const path = require('path');

// Find latest backup
const backupDir = '/root/.openclaw/backups/';
const files = fs.readdirSync(backupDir)
  .filter(f => f.startsWith('openclaw_backup_') && f.endsWith('.tar.gz'))
  .sort()
  .reverse();

if (files.length > 0) {
  const latest = files[0];
  const filePath = path.join(backupDir, latest);
  const stats = fs.statSync(filePath);
  
  console.log(`Latest backup: ${latest}`);
  console.log(`Size: ${stats.size} bytes`);
  console.log(`Path: ${filePath}`);
  console.log(`FILE:${filePath}`);
} else {
  console.log('No backup found');
}
