const { execSync } = require('child_process');

function getWeather() {
  try {
    const result = execSync('curl -s "wttr.in/Hangzhou?lang=zh&format=%l:+%c+%t+(体感%f)+湿度%h+风速%w"', { encoding: 'utf8' });
    return result.trim();
  } catch (e) {
    return '获取天气失败';
  }
}

const weather = getWeather();

console.log(`🌤️ 杭州天气提醒\n`);
console.log(`${weather}\n`);
console.log(`新的一天开始了，记得带伞哦~ 🌸`);
