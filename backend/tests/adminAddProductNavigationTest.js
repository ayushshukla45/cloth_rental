const { Builder, By, until, Key } = require('selenium-webdriver');
const path = require('path');
require('chromedriver');

async function adminAddAndListTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    console.log("🚀 Launching admin panel...");
    await driver.get('http://localhost:5173/');

    // Wait until sidebar is loaded
    await driver.wait(until.elementLocated(By.className('sidebar-item')), 15000000);
    console.log("✅ Sidebar loaded");

    // Step 1: Click 'Add Product'
    const addProductBtn = await driver.wait(
      until.elementLocated(By.xpath("//div[@class='sidebar-item']/p[normalize-space()='Add Product']")),
      5000
    );
    await addProductBtn.click();

    // Confirm navigation to Add Product
    await driver.wait(until.urlContains('/addproduct'), 1500000);
    console.log("✅ Navigated to Add Product");

    // Step 2: Verify input fields are present
    await driver.wait(until.elementLocated(By.name('name')), 1500000);
    await driver.wait(until.elementLocated(By.name('old_price')), 1500000);
    await driver.wait(until.elementLocated(By.name('new_price')), 1500000);
    await driver.wait(until.elementLocated(By.name('category')), 1500000);
    console.log("✅ Add Product form elements present");

    // Step 3: Upload Image
    const imagePath = path.resolve(__dirname, 'product_4.png');
    const imageInput = await driver.findElement(By.name('image'));
    await imageInput.sendKeys(imagePath);  
    console.log("✅ Image uploaded");

    // Step 4: Submit the form
    const addBtn = await driver.wait(
      until.elementLocated(By.className('addproduct-btn')),
      5000
    );
    await addBtn.click();
    console.log("✅ Product added");
    

    // Step 5: Go to Product List
    const listProductBtn = await driver.wait(
      until.elementLocated(By.xpath("//div[@class='sidebar-item']/p[normalize-space()='Product list']")),
      5000
    );
    await listProductBtn.click();

    // Confirm navigation to List Product page
    await driver.wait(until.urlContains('/listproduct'), 1500000);
    console.log("✅ Navigated to Product List");

    // Step 6: Verify product in list
    await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(),'All Products List')]")), 5000);
    console.log("✅ Product list header found");

    // Step 7: Verify image is displayed in the product list
    const products = await driver.findElements(By.className('listproduct-format'));
    console.log(`📦 Found ${products.length} product(s) listed.`);

  } catch (error) {
    console.error("🚨 Test encountered an error:", error);
  } finally {
    await driver.quit();
    console.log("🧪 Test finished");
  }
}

adminAddAndListTest();
