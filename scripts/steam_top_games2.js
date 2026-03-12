const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://steamdb.info/charts/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    // Take screenshot for debugging
    await page.screenshot({ path: '/tmp/steamdb.png' });
    
    // Try different selectors
    const content = await page.content();
    console.log('Page title:', await page.title());
    console.log('Has table:', content.includes('table'));
    console.log('Has tbody:', content.includes('tbody'));
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
