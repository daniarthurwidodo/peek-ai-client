import './setup';
import { Builder, Browser, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

const APP_URL = 'http://localhost:1420';

async function runTests() {
  let driver: WebDriver | null = null;
  
  try {
    console.log('Starting Selenium tests...\n');
    
    // Setup
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    
    driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build();
    
    console.log('✓ Chrome driver initialized\n');
    
    // Test 1: Load app and check welcome message
    console.log('Test 1: Loading app and checking welcome message...');
    await driver.get(APP_URL);
    const heading = await driver.wait(until.elementLocated(By.css('h1')), 10000);
    const headingText = await heading.getText();
    
    if (headingText === 'Welcome to Tauri + React') {
      console.log('✓ Welcome message displayed correctly\n');
    } else {
      throw new Error(`Expected "Welcome to Tauri + React", got "${headingText}"`);
    }
    
    // Test 2: Check sign in button
    console.log('Test 2: Checking sign in button...');
    const signInButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Sign In')]")),
      10000
    );
    
    if (await signInButton.isDisplayed()) {
      console.log('✓ Sign in button is visible\n');
    } else {
      throw new Error('Sign in button not visible');
    }
    
    // Test 3: Check page structure
    console.log('Test 3: Checking page structure...');
    const mainContent = await driver.findElement(By.tagName('main')).getText();
    
    if (mainContent.includes('Welcome to Tauri + React')) {
      console.log('✓ Page structure is correct\n');
    } else {
      throw new Error('Page structure validation failed');
    }
    
    console.log('All tests passed! ✓');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    if (driver) {
      await driver.quit();
      console.log('\nCleaned up Chrome driver');
    }
  }
}

runTests();
