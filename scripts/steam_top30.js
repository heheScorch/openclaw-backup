const https = require('https');

// Get most played games from official API
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

// Get player count for a game
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

// Get game details from Steam Store
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
              type: app.data.type, // game, software, dlc, etc.
              header_image: app.data.header_image,
              metacritic: app.data.metacritic?.score
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
  console.log('获取最热玩游戏榜单...');
  const ranks = await getMostPlayed();
  
  console.log(`获取到 ${ranks.length} 款游戏，开始获取详细信息...`);
  
  const results = [];
  for (let i = 0; i < Math.min(ranks.length, 35); i++) {
    const g = ranks[i];
    const [details, count] = await Promise.all([
      getGameDetails(g.appid),
      getPlayerCount(g.appid)
    ]);
    
    // Filter out non-games
    if (details && details.type === 'game') {
      results.push({
        rank: g.rank,
        appid: g.appid,
        name: details.name,
        header_image: details.header_image,
        count: count,
        last_week: g.last_week_rank
      });
      console.log(`✓ ${g.rank}. ${details.name} - ${count} players`);
    } else {
      console.log(`✗ 跳过 ${g.appid} (类型: ${details?.type || 'unknown'})`);
    }
    
    if (results.length >= 30) break;
  }
  
  console.log(`\n最终结果: ${results.length} 款游戏`);
  
  // Output as JSON for now
  console.log(JSON.stringify(results.slice(0, 30), null, 2));
}

main();
