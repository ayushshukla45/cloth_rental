const { Builder, By, until } = require('selenium-webdriver');

(async function testAddToCart() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // 1. Navigate to the product listing or home page
    await driver.get('http://localhost:3000');

    // 2. Wait for and click on the first product
    await driver.wait(until.elementLocated(By.css('.item')), 1500000);
    const firstProduct = await driver.findElement(By.css('.item'));
    await firstProduct.click();

    // 3. Wait for the size buttons and select a size (e.g., 'M')
    await driver.wait(until.elementLocated(By.css('.productdisplay-right-sizes')), 1000000);
    const sizeButton = await driver.findElement(By.css('.productdisplay-right-sizes div:nth-child(2)')); // Adjust selector if needed
    await sizeButton.click();

    // 4. Wait for the "Add to Cart" button to be located and ensure it is visible and enabled
    await driver.wait(until.elementLocated(By.css('.productdisplay-right button')), 1500000);
    const addToCartButton = await driver.findElement(By.css('.productdisplay-right button'));

    // Check if the button is visible and enabled
    const isDisplayed = await addToCartButton.isDisplayed();
    const isEnabled = await addToCartButton.isEnabled();
    
    if (isDisplayed && isEnabled) {
      await addToCartButton.click();
    } else {
      console.error('Add to Cart button is not clickable.');
      return;
    }

    // 5. Handle the alert that appears after adding to cart
    try {
      await driver.wait(until.alertIsPresent(), 1500000);
      const alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText());
      await alert.accept();  // Accept the alert to proceed
    } catch (alertErr) {
      console.log('No alert appeared.');
    }

    // 6. Wait for the cart counter to update
    await driver.sleep(3000);  // Wait for 3 seconds to ensure the cart is updated

    // 7. Check if the cart counter has increased
    const cartCounter = await driver.findElement(By.css('.nav-cart-counter'));  // Adjust the selector for the cart counter
    const cartCountText = await cartCounter.getText();
    const cartCount = parseInt(cartCountText, 10);

    console.log(`Cart counter after adding product: ${cartCount}`);

    // Verify that the cart count is updated (expected value could be 1)
    if (cartCount === 1) {
      console.log('✅ Product added successfully to the cart.');
    } else {
      console.error('❌ Product not added to the cart. Cart count did not update.');
    }

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await driver.quit();
  }
})();
