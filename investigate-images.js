const { chromium } = require('playwright');

(async () => {
  let browser;
  try {
    console.log('=== HEADLESS BROWSER INVESTIGATION ===\n');

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Set up console message capture
    const consoleLogs = [];
    page.on('console', msg => {
      const logEntry = {
        type: msg.type(),
        text: msg.text()
      };
      consoleLogs.push(logEntry);
      console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    // Capture network requests
    const networkLog = [];
    page.on('response', response => {
      const entry = {
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      };
      networkLog.push(entry);

      // Log placehold.co and image-related requests
      if (response.url().includes('placehold') || response.url().includes('image') || response.url().includes('.jpg') || response.url().includes('.png')) {
        console.log(`[NETWORK] ${response.status()} ${response.url()}`);
      }
    });

    // Capture page errors
    page.on('pageerror', error => {
      console.log(`[PAGE ERROR] ${error.message}`);
      consoleLogs.push({ type: 'error', text: error.message });
    });

    console.log('Navigating to http://localhost:8081...\n');
    const response = await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`Initial page load: ${response.status()}\n`);

    // Wait for menu items to appear
    console.log('Waiting for menu content to render...\n');
    await page.waitForTimeout(3000);

    // Try to detect if menu is rendered
    const menuContent = await page.evaluate(() => {
      const allText = document.body.innerText;
      return allText.substring(0, 500);
    });
    console.log(`Page text content (first 500 chars): ${menuContent}\n`);

    // Capture screenshot
    const screenshotPath = '/private/tmp/claude-501/-Users-jim-Codes-projects-authentic-th/7aed4196-6cc4-45d1-85d9-ff6a1d978034/scratchpad/menu-screenshot.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}\n`);

    // Query all img tags in the DOM
    console.log('=== DOM IMAGE TAGS ===\n');
    const imgTags = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).map((img, i) => ({
        index: i,
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        className: img.className,
        id: img.id,
        computedStyle: {
          display: window.getComputedStyle(img).display,
          visibility: window.getComputedStyle(img).visibility,
          opacity: window.getComputedStyle(img).opacity
        }
      }));
    });

    console.log(`Found ${imgTags.length} img tags:\n`);
    imgTags.forEach((img, i) => {
      console.log(`IMG[${i}]:`);
      console.log(`  src: ${img.src}`);
      console.log(`  alt: ${img.alt}`);
      console.log(`  dimensions: ${img.width}x${img.height} (natural: ${img.naturalWidth}x${img.naturalHeight})`);
      console.log(`  display: ${img.computedStyle.display}, visibility: ${img.computedStyle.visibility}, opacity: ${img.computedStyle.opacity}`);
      console.log('');
    });

    // Capture all network requests
    console.log('\n=== ALL NETWORK REQUESTS (Full Log) ===\n');
    console.log(`Total network requests: ${networkLog.length}\n`);

    networkLog.forEach((req, i) => {
      if (i < 20) {  // Log first 20
        console.log(`[${i}] ${req.status} ${req.url}`);
      }
    });
    if (networkLog.length > 20) {
      console.log(`... and ${networkLog.length - 20} more requests`);
    }

    // Filter for image/resource requests
    const imageRequests = networkLog.filter(r =>
      r.url.includes('placehold') ||
      r.url.match(/\.(jpg|png|gif|webp|svg)$/i) ||
      r.url.includes('image')
    );

    console.log(`\n=== IMAGE/PLACEHOLD.CO REQUESTS ===\n`);
    console.log(`Total image requests: ${imageRequests.length}\n`);
    imageRequests.forEach((req, i) => {
      console.log(`[IMG ${i}] ${req.status} ${req.url}`);
    });

    // Capture all console logs
    console.log('\n=== CONSOLE OUTPUT LOG ===\n');
    console.log(`Total console messages: ${consoleLogs.length}\n`);
    consoleLogs.forEach((log, i) => {
      console.log(`[${i}] [${log.type}] ${log.text}`);
    });

    // Try to find any error boundaries or error overlays
    console.log('\n=== ERROR DETECTION ===\n');
    const errors = await page.evaluate(() => {
      const errorTexts = [];
      const bodyText = document.body.innerText;
      if (bodyText.includes('Error') || bodyText.includes('error') || bodyText.includes('failed')) {
        errorTexts.push(bodyText.substring(0, 500));
      }

      const errorDivs = document.querySelectorAll('[class*="error"], [class*="Error"]');
      errorDivs.forEach(div => {
        if (div.textContent) {
          errorTexts.push(div.textContent.substring(0, 200));
        }
      });

      return errorTexts;
    });

    if (errors.length > 0) {
      console.log(`Found error-related content:`);
      errors.forEach(err => console.log(`  - ${err}`));
    } else {
      console.log('No error messages detected on page');
    }

    // Final summary
    console.log('\n=== INVESTIGATION SUMMARY ===\n');
    console.log(`✓ Page loaded successfully (status: ${response.status()})`);
    console.log(`✓ Total console messages: ${consoleLogs.length}`);
    console.log(`✓ Total network requests: ${networkLog.length}`);
    console.log(`✓ Image-related requests: ${imageRequests.length}`);
    console.log(`✓ DOM img tags found: ${imgTags.length}`);
    console.log(`✓ Screenshot: ${screenshotPath}`);

  } catch (error) {
    console.error('Investigation failed:', error.message);
    console.error(error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
    process.exit(0);
  }
})();
