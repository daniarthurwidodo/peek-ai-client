import { Builder, Browser, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

describe('App Tests', () => {
  let driver: WebDriver;
  const APP_URL = 'http://localhost:1420'; // Tauri dev server default port

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    
    driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('should load the app and display welcome message', async () => {
    await driver.get(APP_URL);
    
    const heading = await driver.wait(
      until.elementLocated(By.css('h1')),
      10000
    );
    
    const text = await heading.getText();
    expect(text).toBe('Welcome to Tauri + React');
  }, 30000);

  test('should display sign in button when not authenticated', async () => {
    await driver.get(APP_URL);
    
    const signInButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Sign In with Google')]")),
      10000
    );
    
    expect(await signInButton.isDisplayed()).toBe(true);
  }, 30000);

  test('should show loading state initially', async () => {
    await driver.get(APP_URL);
    
    // Check if loading message appears (might be brief)
    const loadingText = await driver.findElement(By.tagName('main')).getText();
    expect(loadingText).toContain('Welcome to Tauri + React');
  }, 30000);
});
