const https = require('https');

function getPlayerCount(appId) {
  return new Promise((resolve) => {
    const req = https.get(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ appId, count: json.response?.player_count || 0 });
        } catch (e) { resolve({ appId, count: 0 }); }
      });
    });
    req.on('error', () => resolve({ appId, count: 0 }));
    req.setTimeout(3000, () => { req.destroy(); resolve({ appId, count: 0 }); });
  });
}

function getTopSellers() {
  return new Promise((resolve) => {
    const req = https.get('https://store.steampowered.com/api/featuredcategories/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const sellers = json.top_sellers?.items || [];
          const newReleases = json.new_releases?.items || [];
          const specials = json.specials?.items || [];
          const all = [...sellers, ...newReleases, ...specials];
          const unique = [...new Map(all.map(g => [g.id, g])).values()];
          resolve(unique);
        } catch (e) { resolve([]); }
      });
    });
    req.on('error', () => resolve([]));
  });
}

async function main() {
  console.log('📊 获取Steam热门榜单...');
  const allGames = await getTopSellers();
  console.log(`找到 ${allGames.length} 个游戏`);
  
  const appIds = [...new Set(allGames.map(g => g.id))].slice(0, 30);
  
  console.log(`查询 ${appIds.length} 个游戏的在线人数...`);
  
  // Sequential to avoid rate limiting
  const results = [];
  for (const id of appIds) {
    const r = await getPlayerCount(id);
    results.push(r);
    process.stdout.write('.');
  }
  console.log('\n处理完成');
  
  const games = appIds.map((id, i) => {
    const game = allGames.find(g => g.id === id);
    return {
      name: game?.name || 'Unknown',
      appId: id,
      count: results[i]?.count || 0
    };
  }).sort((a, b) => b.count - a.count);
  
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  let msg = `📊 Steam 热门榜单 TOP 20\n📅 ${now}\n\n`;
  
  games.slice(0, 20).forEach((g, i) => {
    msg += `${i+1}. ${g.name}\n`;
    msg += `   👥 ${g.count.toLocaleString()} 人在线\n\n`;
  });
  
  msg += `— 数据来源：Steam 销量榜`;
  console.log(msg);
}

main();
