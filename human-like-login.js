import puppeteer from "puppeteer";
import config from "./config.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

class HumanLikeLinkedInAutomation {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  // Random delay to mimic human behavior
  async randomDelay(min = 500, max = 2000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Human-like typing with random delays
  async humanType(selector, text) {
    await this.page.click(selector);
    await this.randomDelay(200, 500);

    // Clear field first
    await this.page.keyboard.down("Control");
    await this.page.keyboard.press("KeyA");
    await this.page.keyboard.up("Control");
    await this.randomDelay(100, 300);

    // Type with human-like delays
    for (const char of text) {
      await this.page.keyboard.type(char);
      // Random delay between characters (faster for common chars)
      const delay = char === " " ? 50 : Math.random() * 150 + 50;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  async launchBrowser() {
    console.log("🚀 Launching browser (HUMAN-LIKE MODE)...");

    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
        "--start-maximized",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--no-first-run",
        "--disable-default-apps",
        "--disable-extensions",
        // Add user agent to look more like a real browser
        "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ],
    });

    this.page = await this.browser.newPage();

    // Set realistic viewport
    await this.page.setViewport({ width: 1366, height: 768 });

    // Set user agent
    await this.page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    console.log("✅ Browser launched with human-like settings!");
  }

  async navigateToLogin() {
    console.log("📱 Navigating to LinkedIn (human-like)...");

    await this.page.goto(config.linkedin.loginUrl, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    // Wait a bit like a human would
    await this.randomDelay(1000, 2000);

    await this.page.waitForSelector('input[name="session_key"]', {
      timeout: 10000,
    });

    // Look around the page a bit
    await this.randomDelay(500, 1500);
    console.log("✅ Login page loaded!");
  }

  async fillLoginForm(email, password) {
    console.log("📝 Filling form (human-like typing)...");

    // Wait a bit before starting to fill
    await this.randomDelay(800, 1500);

    // Fill email with human-like behavior
    console.log("📧 Typing email...");
    await this.humanType('input[name="session_key"]', email);

    // Pause between fields like a human would
    await this.randomDelay(1000, 2000);

    // Fill password with human-like behavior
    console.log("🔒 Typing password...");
    await this.humanType('input[name="session_password"]', password);

    // Pause before submitting
    await this.randomDelay(1500, 3000);
    console.log("✅ Form filled with human-like behavior!");
  }

  async submitLogin() {
    console.log("🖱️ Submitting (human-like click)...");

    // Take screenshot before login
    await this.page.screenshot({
      path: "screenshots/linkedin-human-before.png",
      fullPage: true,
    });

    // Move mouse to button first (like a human would)
    const button = await this.page.$('button[type="submit"]');
    const box = await button.boundingBox();
    if (box) {
      // Move mouse to a random position near the button
      const x = box.x + box.width / 2 + (Math.random() - 0.5) * 20;
      const y = box.y + box.height / 2 + (Math.random() - 0.5) * 10;
      await this.page.mouse.move(x, y);
      await this.randomDelay(200, 500);
    }

    // Click the button
    await this.page.click('button[type="submit"]');

    // Wait for response
    await this.randomDelay(2000, 4000);
  }

  async handleLoginResponse() {
    console.log("⏳ Checking response (patiently)...");

    try {
      await Promise.race([
        this.page.waitForNavigation({ timeout: 15000 }),
        this.page.waitForSelector(".alert--error", { timeout: 8000 }),
      ]);
    } catch (error) {
      console.log("⚠️ No immediate response, checking current state...");
    }

    // Wait a bit more like a human would
    await this.randomDelay(1000, 2000);

    // Check for error messages
    const errorElement = await this.page.$(".alert--error, .error-message");
    if (errorElement) {
      const errorText = await this.page.evaluate(
        (el) => el.textContent,
        errorElement
      );
      console.log("❌ Error:", errorText);
      return false;
    }

    const currentUrl = this.page.url();
    console.log("🔗 Current URL:", currentUrl);

    if (currentUrl.includes("/login")) {
      console.log("❌ Still on login page");
      return false;
    }

    console.log("✅ Login successful!");
    return true;
  }

  async takeScreenshot(filename) {
    await this.page.screenshot({
      path: `screenshots/${filename}`,
      fullPage: true,
    });
    console.log(`📸 ${filename}`);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log("🔒 Browser closed");
    }
  }

  async login(email, password) {
    try {
      await this.launchBrowser();
      await this.navigateToLogin();
      await this.fillLoginForm(email, password);
      await this.submitLogin();

      const success = await this.handleLoginResponse();

      if (success) {
        await this.takeScreenshot("linkedin-human-after.png");
        const title = await this.page.title();
        console.log("🔍 Title:", title);
      } else {
        await this.takeScreenshot("linkedin-human-failed.png");
      }

      // Wait to see result
      console.log("⏳ Waiting 5 seconds to see result...");
      await this.randomDelay(5000, 5000);

      return success;
    } catch (error) {
      console.error("❌ Error:", error.message);
      return false;
    } finally {
      await this.close();
    }
  }
}

// Main function
async function main() {
  const email = process.env.LINKEDIN_EMAIL;
  const password = process.env.LINKEDIN_PASSWORD;

  if (!email || !password) {
    console.log("❌ Missing credentials in .env file!");
    return;
  }

  console.log(`📧 Email: ${email}`);
  console.log("🔒 Password loaded");
  console.log("🤖 Using HUMAN-LIKE automation to avoid detection");

  const automation = new HumanLikeLinkedInAutomation();
  const success = await automation.login(email, password);

  console.log(success ? "🎉 HUMAN-LIKE LOGIN SUCCESS!" : "❌ Login failed");
}

main().catch(console.error);
