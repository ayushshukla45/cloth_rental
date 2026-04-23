const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function loginTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    console.log("Navigating to login page...");
    await driver.get('http://localhost:3000/login'); 

    // Wait for and enter the email
    await driver.wait(until.elementLocated(By.name('email')), 1000000).sendKeys('testuser@example.com');
    
    // Wait for and enter the password
    await driver.wait(until.elementLocated(By.name('password')), 1000000).sendKeys('TestPassword123!');
    
    // Click the Continue button
    await driver.wait(until.elementLocated(By.xpath("//button[text()='Continue']")), 1000000).click();

    // Handle any unexpected alert (like the "Please sign up before logging in." message)
    try {
      await driver.wait(until.alertIsPresent(), 500000); // Wait for an alert
      let alert = await driver.switchTo().alert();
      console.log("Alert text: " + await alert.getText()); // Log alert text
      await alert.accept(); // Close the alert
    } catch (err) {
      console.log("No alert appeared.");
    }

    // Wait for the redirection to the homepage URL
    await driver.wait(until.urlIs('http://localhost:3001/'), 1000000);  // Wait until the URL matches your homepage

    console.log("Login test successful! We were redirected to the homepage.");

  } catch (err) {
    console.error("Error during login test:", err);
  } finally {
    await driver.quit();
  }
})();
