const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Go to SteamDB charts
    await page.goto('https://steamdb.info/charts/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Get top 20 games
    const games = await page.evaluate(() => {
      const results = [];
      const rows = document.querySelectorAll('.table tbody tr');
      
      for (let i = 0; i < Math.min(rows.length, 20); i++) {
        const row = rows[i];
        const name = row.querySelector('.game-name')?.textContent?.trim() || '';
        const players = row.querySelector('.player-count')?.textContent?.trim() || '';
        const icon = row.querySelector('.game-icon')?.src || '';
        
        if (name) {
          results.push({ name, players, icon });
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
