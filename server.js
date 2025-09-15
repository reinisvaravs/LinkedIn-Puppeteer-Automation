import puppeteer from "puppeteer";
import config from "./config.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

class LinkedInSearchAutomation {
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
      const delay = char === " " ? 50 : Math.random() * 150 + 50;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  async launchBrowser() {
    console.log("🚀 Launching browser...");

    const isProduction = process.env.NODE_ENV === "production";

    this.browser = await puppeteer.launch({
      headless: isProduction ? "new" : false,
      defaultViewport: null,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--no-first-run",
        "--disable-default-apps",
        "--disable-extensions",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--single-process",
        "--no-zygote",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ],
      ...(isProduction && {
        executablePath: "/usr/bin/google-chrome-stable",
        ignoreDefaultArgs: ["--disable-extensions"],
      }),
    });

    this.page = await this.browser.newPage();

    // Set realistic viewport
    await this.page.setViewport({ width: 1366, height: 768 });

    // Set user agent
    await this.page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    console.log("✅ Browser launched!");
  }

  async saveCookies() {
    try {
      const cookies = await this.page.cookies();
      const fs = await import("fs");
      fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));
      console.log("🍪 Cookies saved!");
    } catch (error) {
      console.log("⚠️ Could not save cookies:", error.message);
    }
  }

  async loadCookies() {
    try {
      const fs = await import("fs");
      if (fs.existsSync("cookies.json")) {
        const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));
        await this.page.setCookie(...cookies);
        console.log("🍪 Cookies loaded!");
        return true;
      }
    } catch (error) {
      console.log("⚠️ Could not load cookies:", error.message);
    }
    return false;
  }

  async login() {
    console.log("🔐 Checking LinkedIn login status...");

    // Try to load cookies first
    const cookiesLoaded = await this.loadCookies();

    if (cookiesLoaded) {
      // Try to navigate to LinkedIn feed to check if cookies work
      await this.page.goto("https://www.linkedin.com/feed/", {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      });

      await this.randomDelay(2000, 3000);

      const currentUrl = this.page.url();
      if (
        !currentUrl.includes("/login") &&
        !currentUrl.includes("/challenge")
      ) {
        console.log("✅ Already logged in via cookies!");
        return true;
      }
    }

    console.log("🔐 Need to login with credentials...");

    // Get credentials from environment variables
    const email = process.env.LINKEDIN_EMAIL;
    const password = process.env.LINKEDIN_PASSWORD;

    if (!email || !password) {
      console.log("❌ Missing credentials in .env file!");
      return false;
    }

    // Navigate to LinkedIn login page
    await this.page.goto(config.linkedin.loginUrl, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    await this.randomDelay(1000, 2000);

    await this.page.waitForSelector('input[name="session_key"]', {
      timeout: 10000,
    });

    await this.randomDelay(500, 1500);

    // Fill login form
    await this.randomDelay(800, 1500);
    await this.humanType('input[name="session_key"]', email);
    await this.randomDelay(1000, 2000);
    await this.humanType('input[name="session_password"]', password);
    await this.randomDelay(1500, 3000);

    // Submit login
    await this.page.click('button[type="submit"]');
    await this.randomDelay(2000, 4000);

    // Check if login successful
    try {
      await this.page.waitForNavigation({ timeout: 15000 });
    } catch (error) {
      console.log("⚠️ No navigation detected, checking current state...");
    }

    const currentUrl = this.page.url();
    if (currentUrl.includes("/login")) {
      console.log("❌ Login failed - still on login page");
      return false;
    }

    console.log("✅ Login successful!");

    // Save cookies for next time
    await this.saveCookies();

    return true;
  }

  async searchForPeople(searchTerm) {
    console.log(`🔍 Searching for: "${searchTerm}"`);

    // Navigate to LinkedIn search
    await this.page.goto("https://www.linkedin.com/search/results/people/", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    await this.randomDelay(1000, 2000);

    // Wait for search input and fill it
    await this.page.waitForSelector('input[aria-label*="Search"]', {
      timeout: 10000,
    });
    await this.randomDelay(500, 1000);

    console.log("📝 Typing search term...");
    await this.humanType('input[aria-label*="Search"]', searchTerm);

    // Press Enter to search
    await this.randomDelay(1000, 2000);
    await this.page.keyboard.press("Enter");

    console.log("⏳ Waiting for search results...");
    await this.randomDelay(3000, 5000);

    console.log("✅ Search completed!");
  }

  async extractPeopleNames(count = 5) {
    console.log(`👥 Extracting names by clicking on first ${count} people...`);

    const names = [];

    try {
      // Wait for search results to load
      await this.randomDelay(3000, 4000);

      // Find all clickable profile links in search results
      const profileLinks = await this.page.$$('a[href*="/in/"]');
      console.log(`📊 Found ${profileLinks.length} profile links on the page`);

      // Filter out non-profile links and get unique ones
      const validLinks = [];
      console.log("🔍 Analyzing found links...");

      for (const link of profileLinks) {
        const href = await this.page.evaluate((el) => el.href, link);
        console.log(`📋 Found link: ${href}`);

        if (href && href.includes("/in/")) {
          // Extract LinkedIn name from URL - handle both formats
          let linkedinName = null;

          // Try to extract from URL like /in/ed-lapins or /in/ACoAABMrZfYBjFv7SDpN--vH840FojSVNdPqXB0
          const urlMatch = href.match(/\/in\/([^\/\?]+)/);
          if (urlMatch) {
            linkedinName = urlMatch[1];
            console.log(`👤 Potential profile: ${linkedinName}`);

            // Filter out obvious non-profiles and avoid duplicates
            if (
              !validLinks.some((l) => l.name === linkedinName) &&
              !linkedinName.includes("search") &&
              !linkedinName.includes("company") &&
              linkedinName.length > 2 &&
              !linkedinName.startsWith("ACoAA") // Filter out LinkedIn internal IDs
            ) {
              validLinks.push({
                element: link,
                name: linkedinName,
                url: href,
              });
              console.log(`✅ Added valid profile: ${linkedinName}`);
            }
          }
        }
      }

      console.log(`📊 Found ${validLinks.length} unique profile links`);

      // Click on each person and extract their name from the URL
      for (let i = 0; i < Math.min(count, validLinks.length); i++) {
        try {
          const person = validLinks[i];
          console.log(`👤 ${i + 1}. Clicking on profile: ${person.name}`);

          // Find the link fresh each time to avoid detached DOM issues
          const profileLinks = await this.page.$$('a[href*="/in/"]');
          let targetLink = null;

          for (const link of profileLinks) {
            const href = await this.page.evaluate((el) => el.href, link);
            if (href === person.url) {
              targetLink = link;
              break;
            }
          }

          if (targetLink) {
            // Click on the profile link
            await targetLink.click();
          } else {
            console.log(`⚠️ Could not find link for ${person.name}`);
            continue;
          }

          // Wait for navigation
          await this.randomDelay(2000, 3000);

          // Get the current URL
          const currentUrl = this.page.url();
          console.log(`🔗 Current URL: ${currentUrl}`);

          // Extract LinkedIn name from the profile URL
          const urlMatch = currentUrl.match(/\/in\/([^\/]+)\//);
          if (urlMatch) {
            const linkedinName = urlMatch[1];
            names.push(linkedinName);
            console.log(`✅ Extracted: ${linkedinName}`);
          }

          // Go back to search results
          await this.page.goBack();
          await this.randomDelay(2000, 3000);
        } catch (error) {
          console.log(`⚠️ Error clicking on person ${i + 1}: ${error.message}`);
          // Try to go back if we're stuck
          try {
            await this.page.goBack();
            await this.randomDelay(1000, 2000);
          } catch (e) {
            // If we can't go back, navigate to search again
            await this.page.goto(
              "https://www.linkedin.com/search/results/people/?keywords=web%20development%20agency",
              {
                waitUntil: "domcontentloaded",
                timeout: 10000,
              }
            );
            await this.randomDelay(2000, 3000);
          }
        }
      }
    } catch (error) {
      console.log(`❌ Error extracting names: ${error.message}`);
    }

    return names;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log("🔒 Browser closed");
    }
  }

  async runSearch(searchTerm = "web development agency", peopleCount = 5) {
    try {
      await this.launchBrowser();

      const loginSuccess = await this.login();
      if (!loginSuccess) {
        console.log("❌ Login failed, cannot proceed with search");
        return;
      }

      await this.searchForPeople(searchTerm);
      const names = await this.extractPeopleNames(peopleCount);

      console.log("\n🎯 EXTRACTED NAMES:");
      console.log("==================");
      names.forEach((name, index) => {
        console.log(`${index + 1}. ${name}`);
      });
      console.log("==================");

      // Wait to see results
      console.log("⏳ Waiting 5 seconds to see results...");
      await this.randomDelay(5000, 5000);

      return names;
    } catch (error) {
      console.error("❌ Error during search:", error.message);
      return [];
    } finally {
      await this.close();
    }
  }
}

// Main function
async function main() {
  const searchTerm = process.env.SEARCH_TERM || "web development agency";
  const peopleCount = parseInt(process.env.PEOPLE_COUNT) || 5;
  const isCron = process.argv.includes("--cron");

  if (isCron) {
    console.log("⏰ Running scheduled LinkedIn automation...");
  } else {
    console.log("🚀 Starting LinkedIn Search Automation");
  }

  console.log(`🔍 Search term: "${searchTerm}"`);
  console.log(`👥 Target: ${peopleCount} people`);

  const automation = new LinkedInSearchAutomation();
  const names = await automation.runSearch(searchTerm, peopleCount);

  if (names.length > 0) {
    console.log(`\n🎉 Successfully extracted ${names.length} LinkedIn names!`);

    // In cron mode, you could send results via email/webhook
    if (isCron) {
      console.log("📧 Results could be sent via email/webhook here");
    }
  } else {
    console.log("\n❌ No names were extracted");
  }
}

main().catch(console.error);
