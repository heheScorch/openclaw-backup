const https = require('https');

// Non-game software to exclude
const EXCLUDE_LIST = [
  'wallpaper engine',  // Wallpaper Engine
  'steamvr',
  'valve index',
  'ue4', 'ue5'
];

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
          if (app && app.success) {
            resolve({
              name: app.data.name,
              type: app.data.type,
              header_image: app.data.header_image
            });
          } else {
            resolve(null);
          }
        } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const ranks = await getMostPlayed();
  const results = [];
  
  for (let i = 0; i < ranks.length && results.length < 30; i++) {
    const g = ranks[i];
    const [details, count] = await Promise.all([
      getGameDetails(g.appid),
      getPlayerCount(g.appid)
    ]);
    
    // Skip non-games
    if (!details) continue;
    if (details.type !== 'game') continue;
    
    // Also skip by name
    const nameLower = details.name.toLowerCase();
    if (EXCLUDE_LIST.some(k => nameLower.includes(k))) {
      console.log(`跳过: ${details.name}`);
      continue;
    }
    
    results.push({
      rank: results.length + 1,
      appid: g.appid,
      name: details.name,
      header_image: details.header_image,
      count: count,
      peak: g.peak_in_game
    });
    
    if (results.length <= 30) {
      console.log(`${results.length}. ${details.name} - ${count} 在线`);
    }
  }
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync('/root/.openclaw/data/steam_top30.json', JSON.stringify(results, null, 2));
  console.log(`\n已保存到文件，共 ${results.length} 款游戏`);
}

main();
