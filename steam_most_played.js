const https = require('https');

const gameNames = {
  730: { name: 'Counter-Strike 2', icon: '🎯' },
  578080: { name: 'PUBG', icon: '🔫' },
  570: { name: 'Dota 2', icon: '⚔️' },
  2868840: { name: 'Slay the Spire 2', icon: '🃏' },
  431960: { name: 'Wallpaper Engine', icon: '🖼️' },
  1172470: { name: 'Apex Legends', icon: '🏃' },
  1808500: { name: 'Lost Ark', icon: '🗡️' },
  271590: { name: 'GTA V', icon: '🚗' },
  322170: { name: 'Mirage', icon: '🎮' },
  2357570: { name: 'Path of Exile 2', icon: '🔥' },
  2676230: { name: 'Marvel Rivals', icon: '🦸' },
  359550: { name: 'Rainbow Six Siege', icon: '🛡️' },
  236390: { name: 'Warframe', icon: '🦋' },
  3764200: { name: 'Delta Force', icon: '💪' },
  1422450: { name: 'Pixel Sundays', icon: '🎨' },
  105600: { name: 'Terraria', icon: '⛏️' },
  2767030: { name: 'Hunt: Showdown', icon: '🔍' },
  553850: { name: 'ARK', icon: '🦖' },
  1973530: { name: 'Lethal Company', icon: '👻' },
  413150: { name: 'Helldivers 2', icon: '🎖️' },
  2807960: { name: 'S.T.A.L.K.E.R. 2', icon: '☢️' },
  252490: { name: 'Rust', icon: '🏗️' },
  2507950: { name: 'The First Descendant', icon: '👾' },
  381210: { name: 'Dead by Daylight', icon: '🔪' },
  3240220: { name: 'Once Human', icon: '🧟' },
  3405690: { name: 'Delta Force', icon: '💪' },
  230410: { name: 'SCUM', icon: '🏝️' },
  3241660: { name: 'FragPunk', icon: '💥' },
  440: { name: 'Team Fortress 2', icon: '🔨' },
  238960: { name: 'Path of Exile', icon: '⚡' },
  1203220: { name: 'Mount & Blade II', icon: '⚔️' },
  4465480: { name: 'Nightkeep', icon: '🌙' },
  438100: { name: 'War Thunder', icon: '✈️' },
  227300: { name: 'Warface', icon: '🎖️' },
  3065800: { name: 'The Finals', icon: '🏆' },
  646570: { name: 'Soulstone', icon: '💎' },
  1086940: { name: "Baldur's Gate 3", icon: '🐉' },
  2744880: { name: 'The Wheel of Time', icon: '🎡' },
  252950: { name: 'Craftopia', icon: '🔧' },
  1281930: { name: 'Football Manager 2025', icon: '⚽' },
  550: { name: 'Left 4 Dead 2', icon: '🧟' },
  686060: { name: 'Layer III', icon: '🎮' },
  1938090: { name: 'Goontrack', icon: '🛤️' },
  394360: { name: 'Hearts of Iron IV', icon: '🗺️' },
  1449850: { name: 'CRIMESIGHT', icon: '🔍' },
  2246340: { name: 'Once Human', icon: '🧟' },
  284160: { name: '0 AD', icon: '⚔️' },
  1174180: { name: 'RDR 2', icon: '🤠' },
  322330: { name: 'Warface', icon: '🎮' },
  250900: { name: 'The Witcher 3', icon: '🧙' },
};

function fetchMostPlayed() {
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

async function main() {
  const ranks = await fetchMostPlayed();
  
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  let msg = `🎮 Steam 最热玩游戏 TOP 20\n📅 ${now}\n\n`;
  
  ranks.slice(0, 20).forEach((g, i) => {
    const game = gameNames[g.appid] || { name: `App ${g.appid}`, icon: '🎮' };
    const trend = g.last_week_rank > 0 
      ? (g.rank < g.last_week_rank ? '📈' : g.rank > g.last_week_rank ? '📉' : '➡️')
      : '🆕';
    
    msg += `${i+1}. ${game.icon} ${game.name} ${trend}\n`;
    msg += `   当前排名: ${g.rank} (上周: ${g.last_week_rank > 0 ? g.last_week_rank : '新进榜'})\n\n`;
  });
  
  msg += `— 数据来源：Steam 官方 API`;
  console.log(msg);
}

main();
