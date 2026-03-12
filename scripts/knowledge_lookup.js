const fs = require('fs');

const KNOWLEDGE_FILE = '/root/.openclaw/data/knowledge/queries.yaml';

function lookup(query) {
  const content = fs.readFileSync(KNOWLEDGE_FILE, 'utf8');
  const lowerQuery = query.toLowerCase();
  
  // Simple search
  if (content.toLowerCase().includes(lowerQuery)) {
    console.log(`找到相关记录: ${query}`);
    return true;
  }
  return false;
}

const query = process.argv.slice(2).join(' ');
if (query) {
  const found = lookup(query);
  if (!found) {
    console.log(`知识库中未找到: ${query}`);
    console.log('需要新建查询方法吗？');
  }
} else {
  console.log('Usage: node knowledge_lookup.js "<查询关键词>"');
}
