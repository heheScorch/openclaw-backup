const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://steamcharts.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Get top games
    const games = await page.evaluate(() => {
      const results = [];
      const rows = document.querySelectorAll('#top-games .chart-row, .trending .chart-row, tr');
      
      for (let i = 0; i < Math.min(rows.length, 20); i++) {
        const row = rows[i];
        const name = row.querySelector('a')?.textContent?.trim() || '';
        const players = row.querySelector('.num')?.textContent?.trim() || '';
        
        if (name && players) {
          results.push({ name, players });
        }
      }
      return results;
    });
    
    console.log(JSON.stringify(games.slice(0, 20), null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
