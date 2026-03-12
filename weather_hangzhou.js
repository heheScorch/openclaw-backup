const { execSync } = require('child_process');

function getWeather() {
  try {
    // Get basic weather
    const basic = execSync('curl -s "wttr.in/Hangzhou?lang=zh&format=%l:+%c+%t+体感%f+湿度%h"' , { encoding: 'utf8' }).trim();
    
    // Get JSON for temperature range
    const json = execSync('curl -s "wttr.in/Hangzhou?format=j1"' , { encoding: 'utf8' });
    const data = JSON.parse(json);
    const today = data.weather[0];
    
    // Calculate temperature range
    const temps = [];
    const hourly = today.hourly;
    for (const h of hourly) {
      const t = parseInt(h.tempC);
      if (!isNaN(t)) temps.push(t);
    }
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    
    // Get weather condition
    const hasRain = JSON.stringify(hourly).includes('雨');
    
    const todayStr = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
    
    return {
      basic,
      range: `${minTemp}°C - ${maxTemp}°C`,
      hasRain,
      today: todayStr
    };
  } catch (e) {
    return null;
  }
}

const data = getWeather();

if (data) {
  console.log(`🌤️ 杭州天气预报 - ${data.today}\n`);
  console.log(`📊 温度区间: ${data.range}\n`);
  console.log(`${data.basic}\n`);
  
  if (data.hasRain) {
    console.log(`🌂 可能有雨，记得带伞哦~`);
  } else {
    console.log(`☀️ 天气不错，出行愉快！`);
  }
} else {
  console.log(`获取天气失败`);
}
