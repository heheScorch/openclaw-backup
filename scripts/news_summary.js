const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const allNews = [];
  
  try {
    // 新浪财经 - 股票新闻
    const sina = await fetchUrl('https://finance.sina.com.cn/stock/');
    if (sina) {
      // Extract article links with their titles
      const pattern = /<a[^>]+href="(https?:\/\/finance\.sina\.com\.cn\/stock\/[^"]+)"[^>]*>([^<]{15,80})<\/a>/g;
      let match;
      while ((match = pattern.exec(sina)) !== null) {
        if (!match[1].includes('//')) continue;
        allNews.push({ source: '新浪财经', title: match[2].trim(), url: match[1] });
      }
    }
    
    // 东方财富 - 新闻
    const eastmoney = await fetchUrl('https://www.eastmoney.com/');
    if (eastmoney) {
      const pattern = /<a[^>]+href="(https?:\/\/[^"]+\.eastmoney\.com\/[^"]+)"[^>]*>([^<]{15,80})<\/a>/g;
      let match;
      while ((match = pattern.exec(eastmoney)) !== null) {
        if (match[1].includes('quote') || match[1].includes('data')) continue;
        allNews.push({ source: '东方财富', title: match[2].trim(), url: match[1] });
      }
    }
    
    // 财联社
    const cls = await fetchUrl('https://www.cls.cn/');
    if (cls) {
      const pattern = /<a[^>]+href="(https?:\/\/www\.cls\.cn\/[^"]+)"[^>]*>([^<]{15,80})<\/a>/g;
      let match;
      while ((match = pattern.exec(cls)) !== null) {
        allNews.push({ source: '财联社', title: match[2].trim(), url: match[1] });
      }
    }
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  // Deduplicate
  const seen = new Set();
  const unique = [];
  for (const n of allNews) {
    const key = n.title.substring(0, 25);
    if (!seen.has(key) && n.url && n.url.length > 50) {
      seen.add(key);
      unique.push(n);
    }
  }
  
  const result = unique.slice(0, 10);
  
  const now = new Date().toLocaleString('zh-CN', { 
    timeZone: 'Asia/Shanghai',
    year: 'numeric', month: 'long', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });
  
  let msg = `📰 全球重要新闻汇总\n📅 ${now}\n\n`;
  
  if (result.length > 0) {
    result.forEach((n, i) => {
      msg += `${i + 1}. ${n.title}\n`;
      msg += `   🔗 ${n.url}\n`;
      msg += `   📍 ${n.source}\n\n`;
    });
  } else {
    msg += '暂无新闻数据\n';
  }
  
  msg += '— 新闻来源：新浪财经、东方财富、财联社';
  console.log(msg);
}

main();
