const https = require('https');

function getPlayerCount(appId) {
  return new Promise((resolve) => {
    https.get(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ appId, count: json.response?.player_count || 0 });
        } catch (e) { resolve({ appId, count: 0 }); }
      });
    }).on('error', () => resolve({ appId, count: 0 }));
  });
}

function getTopSellers() {
  return new Promise((resolve) => {
    https.get('https://store.steampowered.com/api/featuredcategories/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const items = json.top_sellers?.items || [];
          resolve(items);
        } catch (e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

async function main() {
  console.log('获取销量榜前30游戏...');
  const sellers = await getTopSellers();
  const top30 = sellers.slice(0, 30);
  
  console.log(`找到 ${top30.length} 个游戏，开始查询在线人数...`);
  
  const promises = top30.map(g => getPlayerCount(g.id));
  const results = await Promise.all(promises);
  
  const games = top30.map((g, i) => ({
    name: g.name,
    appId: g.id,
    price: g.price || 'N/A',
    count: results[i]?.count || 0
  })).sort((a, b) => b.count - a.count);
  
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  let msg = `📊 Steam 销量榜 TOP 30 + 在线人数\n📅 ${now}\n\n`;
  
  games.forEach((g, i) => {
    msg += `${i+1}. ${g.name}\n`;
    msg += `   💰 ${g.price}\n`;
    msg += `   👥 ${g.count.toLocaleString()} 人在线\n\n`;
  });
  
  msg += `— 数据来源：Steam API`;
  console.log(msg);
}

main();
