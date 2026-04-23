const { Builder, By, Key, until } = require('selenium-webdriver');

(async function testClothRentingApp() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Go to your website
    await driver.get('http://localhost:3000');

    // Wait for the homepage title to appear
    await driver.wait(until.titleContains('Cloth Renting Website'), 5000);

    console.log("✅ Website loaded successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await driver.quit(); // Close the browser
  }
})();
