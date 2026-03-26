const fs = require('fs');
const path = require('path');

const KNOWLEDGE_FILE = '/root/.openclaw/data/knowledge/queries.yaml';

function addQuery(name, description, source, method) {
  let content = fs.readFileSync(KNOWLEDGE_FILE, 'utf8');
  
  const entry = `
  - name: ${name}
    description: ${description}
    source: ${source}
    query_method: ${method}
    updated: ${new Date().toISOString().split('T')[0]}`;
  
  // Append to examples section
  content = content.replace('# 查询知识库', `# 查询知识库${entry}`);
  
  fs.writeFileSync(KNOWLEDGE_FILE, content);
  console.log(`已添加: ${name}`);
}

// CLI args
const args = process.argv.slice(2);
if (args.length >= 4) {
  addQuery(args[0], args[1], args[2], args[3]);
} else {
  console.log('Usage: node knowledge_add.js "<name>" "<description>" "<source>" "<method>"');
}
