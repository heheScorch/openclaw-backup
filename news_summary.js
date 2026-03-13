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

function extractNews(html, source, minLen = 15, maxLen = 80) {
  const news = [];
  // Simple regex to extract titles and links
  const linkPattern = /<a[^>]+href="([^"]+)"[^>]*>([^<]{5,100})<\/a>/g;
  let match;
  while ((match = linkPattern.exec(html)) !== null) {
    const url = match[1];
    const title = match[2].replace(/<[^>]+>/g, '').trim();
    if (title.length >= minLen && title.length <= maxLen && !title.includes('undefined')) {
      news.push({ source, title, url });
    }
  }
  return news;
}

async function main() {
  const allNews = [];
  
  try {
    // 新浪财经
    const sina = await fetchUrl('https://finance.sina.com.cn/stock/');
    if (sina) {
      const sinaNews = extractNews(sina, '新浪财经');
      allNews.push(...sinaNews);
    }
    
    // 东方财富
    const eastmoney = await fetchUrl('https://www.eastmoney.com/');
    if (eastmoney) {
      const emNews = extractNews(eastmoney, '东方财富');
      allNews.push(...emNews);
    }
    
    // 华尔街见闻
    const wsjcn = await fetchUrl('https://www.wallstreetcn.com/');
    if (wsjcn) {
      const wsjNews = extractNews(wsjcn, '华尔街见闻');
      allNews.push(...wsjNews);
    }
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  // Deduplicate and clean
  const seen = new Set();
  const unique = [];
  for (const n of allNews) {
    const key = n.title.substring(0, 20);
    if (!seen.has(key)) {
      seen.add(key);
      // Clean URL
      if (n.url && !n.url.startsWith('http')) {
        n.url = 'https://' + n.url;
      }
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
      if (n.url) {
        msg += `   🔗 ${n.url}\n`;
      }
      msg += `   📍 ${n.source}\n\n`;
    });
  } else {
    msg += '暂无新闻数据\n';
  }
  
  msg += '— 新闻来源：新浪财经、东方财富、华尔街见闻';
  console.log(msg);
}

main();
