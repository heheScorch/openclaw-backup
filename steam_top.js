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
        } catch (e) {
          resolve({ appId, count: 0 });
        }
      });
    }).on('error', () => {
      resolve({ appId, count: 0 });
    });
  });
}

// Popular Steam game IDs with descriptions
const popularGames = [
  { appId: 730, name: 'Counter-Strike 2', desc: '经典FPS射击游戏', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/capsule_616x353.jpg' },
  { appId: 570, name: 'Dota 2', desc: '经典MOBA游戏', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/capsule_616x353.jpg' },
  { appId: 440, name: 'Team Fortress 2', desc: 'Valve出品FPS', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/capsule_616x353.jpg' },
  { appId: 292030, name: 'The Witcher 3', desc: '巫师3：狂猎', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/capsule_616x353.jpg' },
  { appId: 1091500, name: 'Cyberpunk 2077', desc: '赛博朋克2077', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg' },
  { appId: 1174180, name: 'Red Dead Redemption 2', desc: '荒野大镖客2', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg' },
  { appId: 1551360, name: 'Forgotten', desc: '独立恐怖游戏', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/capsule_616x353.jpg' },
  { appId: 814380, name: 'Sekiro', desc: '只狼：影逝二度', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/capsule_616x353.jpg' },
  { appId: 552520, name: 'Far Cry 5', desc: '孤岛惊魂5', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/552520/capsule_616x353.jpg' },
  { appId: 1086940, name: 'Baldur\'s Gate 3', desc: '博德之门3', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/capsule_616x353.jpg' },
  { appId: 1245620, name: 'Elden Ring', desc: '艾尔登法环', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg' },
  { appId: 271590, name: 'GTA V', desc: '侠盗猎车手5', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/capsule_616x353.jpg' },
  { appId: 252490, name: 'Rust', desc: '生存建造游戏', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252490/capsule_616x353.jpg' },
  { appId: 105600, name: 'Terraria', desc: '泰拉瑞亚', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/capsule_616x353.jpg' },
  { appId: 581320, name: 'War Thunder', desc: '战争雷霆', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/581320/capsule_616x353.jpg' },
  { appId: 895870, name: 'Palworld', desc: '幻兽帕鲁', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/895870/capsule_616x353.jpg' },
  { appId: 359550, name: 'Rainbow Six Siege', desc: '彩虹六号', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/359550/capsule_616x353.jpg' },
  { appId: 578080, name: 'PUBG', desc: '绝地求生', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/578080/capsule_616x353.jpg' },
  { appId: 1174180, name: 'Red Dead Redemption 2', desc: '荒野大镖客2', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg' },
  { appId: 1888930, name: 'The Last of Us', desc: '最后生还者', icon: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1888930/capsule_616x353.jpg' },
];

// Get unique games
const uniqueGames = [...new Map(popularGames.map(g => [g.appId, g])).values()].slice(0, 30);

async function main() {
  const promises = uniqueGames.map(g => getPlayerCount(g.appId));
  const results = await Promise.all(promises);
  
  const gamesWithCounts = results
    .map((r, i) => ({ ...uniqueGames[i], count: r.count }))
    .filter(g => g.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  // Output as JSON for easier processing
  console.log(JSON.stringify(gamesWithCounts, null, 2));
}

main();
