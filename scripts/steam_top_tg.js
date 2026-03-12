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

const popularGames = [
  { appId: 730, name: 'Counter-Strike 2', desc: '经典FPS射击', icon: '🎯' },
  { appId: 570, name: 'Dota 2', desc: '经典MOBA', icon: '⚔️' },
  { appId: 578080, name: 'PUBG', desc: '绝地求生', icon: '🔫' },
  { appId: 252490, name: 'Rust', desc: '生存建造', icon: '🏗️' },
  { appId: 271590, name: 'GTA V', desc: '侠盗猎车手', icon: '🚗' },
  { appId: 440, name: 'Team Fortress 2', desc: 'Valve FPS', icon: '🔨' },
  { appId: 359550, name: 'Rainbow Six Siege', desc: '彩虹六号', icon: '🛡️' },
  { appId: 105600, name: 'Terraria', desc: '泰拉瑞亚', icon: '⛏️' },
  { appId: 1086940, name: "Baldur's Gate 3", desc: '博德之门3', icon: '🐉' },
  { appId: 1245620, name: 'Elden Ring', desc: '艾尔登法环', icon: '💍' },
  { appId: 1091500, name: 'Cyberpunk 2077', desc: '赛博朋克', icon: '🤖' },
  { appId: 1174180, name: 'RDR 2', desc: '荒野大镖客', icon: '🤠' },
  { appId: 292030, name: 'The Witcher 3', desc: '巫师3', icon: '🧙' },
  { appId: 814380, name: 'Sekiro', desc: '只狼', icon: '🗡️' },
  { appId: 1551360, name: 'Forgotten', desc: '恐怖游戏', icon: '👻' },
  { appId: 895870, name: 'Palworld', desc: '幻兽帕鲁', icon: '🦖' },
  { appId: 552520, name: 'Far Cry 5', desc: '孤岛惊魂', icon: '🏔️' },
  { appId: 581320, name: 'War Thunder', desc: '战争雷霆', icon: '✈️' },
  { appId: 1888930, name: 'The Last of Us', desc: '最后生还者', icon: '🧱' },
  { appId: 1158310, name: 'Crab Game', desc: '螃蟹游戏', icon: '🦀' },
];

const uniqueGames = [...new Map(popularGames.map(g => [g.appId, g])).values()].slice(0, 25);

async function main() {
  const promises = uniqueGames.map(g => getPlayerCount(g.appId));
  const results = await Promise.all(promises);
  
  const gamesWithCounts = results
    .map((r, i) => ({ ...uniqueGames[i], count: r.count }))
    .filter(g => g.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  let msg = `🎮 Steam 当前热门游戏 TOP 20\n📅 ${now}\n\n`;
  
  gamesWithCounts.forEach((g, i) => {
    msg += `${i+1}. ${g.icon} ${g.name}\n`;
    msg += `   👥 ${g.count.toLocaleString()} 人在线\n`;
    msg += `   📝 ${g.desc}\n\n`;
  });
  
  msg += `— 数据来源：Steam API`;
  console.log(msg);
}

main();
