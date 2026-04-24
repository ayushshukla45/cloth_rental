const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');
require('selenium-webdriver/edge'); // This will automatically work with Edge

async function compatibilityTest() {
  // Define browsers to test
  const browsers = ['firefox', 'MicrosoftEdge'];
  const resolutions = [
    { width: 1920, height: 1080 }, // Desktop
    { width: 1280, height: 720 }, // Tablet Landscape
    { width: 768, height: 1024 }, // Tablet Portrait
    { width: 375, height: 812 }, // Mobile (iPhone X)
  ];

  // Store results to summarize later
  let testResults = [];

  for (const browser of browsers) {
    // Create the browser instance only once per test
    let driver = await new Builder().forBrowser(browser).build();

    for (const resolution of resolutions) {
      let result = { browser, resolution: resolution, status: 'success', errors: [] };

      try {
        console.log(`Testing on ${browser} with resolution ${resolution.width}x${resolution.height}`);
        await driver.manage().window().setRect(resolution);

        // Navigate to the website
        await driver.get('http://localhost:3000'); 

        // Validate Navbar
        const navbar = await driver.findElement(By.className('navbar'));
        if (await navbar.isDisplayed()) {
          console.log('Navbar is visible');
        } else {
          result.errors.push('Navbar is not visible');
        }

        const navLinks = await driver.findElements(By.css('.nav-menu li'));
        console.log(`Found ${navLinks.length} navigation links`);
        for (let link of navLinks) {
          console.log(await link.getText());
        }

        // Test dropdown toggle (mobile view)
        if (resolution.width <= 800) {
          const dropdown = await driver.findElement(By.className('nav-dropdown'));
          await dropdown.click();
          const menuVisible = await driver.findElement(By.className('nav-menu-visible'));
          const isMenuVisible = await menuVisible.isDisplayed();
          console.log('Dropdown menu is toggling correctly:', isMenuVisible);
          if (!isMenuVisible) {
            result.errors.push('Dropdown menu did not toggle correctly');
          }
        }

        // Test Footer
        const footer = await driver.findElement(By.className('footer'));
        if (await footer.isDisplayed()) {
          console.log('Footer is visible');
        } else {
          result.errors.push('Footer is not visible');
        }

        const socialIcons = await driver.findElements(By.css('.footer-icons-container img'));
        console.log(`Found ${socialIcons.length} social icons in the footer`);

        // Test Login/Logout button
        const loginButton = await driver.findElement(By.css('.nav-login-cart button'));
        const buttonText = await loginButton.getText();
        console.log(`Login/Logout button text: ${buttonText}`);

        // Check if the page has loaded correctly by looking for a known page element
        const pageLoadedElement = await driver.findElement(By.css('body')); // Check if the body element is loaded
        if (pageLoadedElement) {
          console.log('Page loaded successfully');
        } else {
          result.errors.push('Page did not load correctly');
        }

        // Check if main images or dynamic content (like banners) are present
        const images = await driver.findElements(By.tagName('img'));
        if (images.length === 0) {
          result.errors.push('No images found on the page');
        }

      } catch (error) {
        result.status = 'failure';
        result.errors.push(`Test failed with error: ${error.message}`);
      }

      // Store the result for the current browser and resolution
      testResults.push(result);
    }

    // Quit the browser after testing all resolutions
    await driver.quit();
  }

  // Display results summary
  console.log('\nTest Results Summary:');
  for (let result of testResults) {
    const { browser, resolution, status, errors } = result;
    console.log(`\nTesting on ${browser} with resolution ${resolution.width}x${resolution.height}`);
    if (status === 'success') {
      console.log('All tests passed successfully!');
    } else {
      console.log('Test failed!');
      console.log(`Errors:`);
      errors.forEach(error => console.log(`- ${error}`));
    }
  }
}

compatibilityTest();
