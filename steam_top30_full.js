const https = require('https');
const fs = require('fs');

const EXCLUDE_LIST = ['wallpaper engine', 'steamvr', 'valve index'];

function getMostPlayed() {
  return new Promise((resolve) => {
    https.get('https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.response?.ranks || []);
        } catch (e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

function getPlayerCount(appId) {
  return new Promise((resolve) => {
    https.get(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.response?.player_count || 0);
        } catch (e) { resolve(0); }
      });
    }).on('error', () => resolve(0));
  });
}

function getGameDetails(appId) {
  return new Promise((resolve) => {
    https.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const app = json[String(appId)];
          if (app && app.success && app.data.type === 'game') {
            resolve({ name: app.data.name, header_image: app.data.header_image });
          } else {
            resolve(null);
          }
        } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  console.log('获取Steam最热玩榜单...');
  const ranks = await getMostPlayed();
  const results = [];
  
  for (let i = 0; i < ranks.length && results.length < 30; i++) {
    const g = ranks[i];
    const [details, count] = await Promise.all([
      getGameDetails(g.appid),
      getPlayerCount(g.appid)
    ]);
    
    if (!details) continue;
    
    const nameLower = details.name.toLowerCase();
    if (EXCLUDE_LIST.some(k => nameLower.includes(k))) continue;
    
    results.push({
      rank: results.length + 1,
      appid: g.appid,
      name: details.name,
      header_image: details.header_image,
      current: count,
      peak: g.peak_in_game
    });
    
    console.log(`${results.length}. ${details.name} - 当前:${count} 峰值:${g.peak_in_game}`);
  }
  
  // Sort by current players
  results.sort((a, b) => b.current - a.current);
  results.forEach((r, i) => r.rank = i + 1);
  
  // Save
  fs.writeFileSync('/root/.openclaw/data/steam_top30.json', JSON.stringify(results, null, 2));
  
  // Generate output
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  let msg = `🎮 Steam 最热玩游戏 TOP 30\n📅 ${now}\n\n`;
  
  results.forEach((g, i) => {
    msg += `${g.rank}. ${g.name}\n`;
    msg += `   🖼️ ${g.header_image}\n`;
    msg += `   👥 当前: ${g.current.toLocaleString()} | 峰值: ${g.peak.toLocaleString()}\n\n`;
  });
  
  msg += '— 数据来源：Steam 官方 API';
  console.log('\n' + msg);
}

main();
