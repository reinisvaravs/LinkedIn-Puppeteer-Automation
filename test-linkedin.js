import puppeteer from "puppeteer";

async function testLinkedIn() {
  console.log("🚀 Starting browser automation test...");

  let browser;
  try {
    // Launch browser with visible window
    browser = await puppeteer.launch({
      headless: false, // Show the browser window
      slowMo: 1000, // Slow down actions by 1 second so you can see them
      defaultViewport: null, // Use full window size
      args: [
        "--start-maximized", // Start with maximized window
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--no-first-run",
        "--disable-default-apps",
        "--disable-extensions",
      ],
    });

    console.log("✅ Browser launched successfully!");

    // Create a new page
    const page = await browser.newPage();

    // No need to set viewport since we're using defaultViewport: null

    console.log("📱 Opening LinkedIn...");

    // Navigate to LinkedIn
    await page.goto("https://www.linkedin.com", {
      waitUntil: "domcontentloaded", // Wait for DOM to load
      timeout: 15000, // 15 second timeout
    });

    console.log("✅ Successfully opened LinkedIn!");
    console.log("🔍 Current page title:", await page.title());

    // Wait for 10 seconds so you can see the page
    console.log("⏳ Waiting 10 seconds so you can see the browser window...");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Take a screenshot
    await page.screenshot({
      path: "screenshots/linkedin-homepage.png",
      fullPage: true,
    });
    console.log("📸 Screenshot saved to screenshots/linkedin-homepage.png");
  } catch (error) {
    console.error("❌ Error occurred:", error.message);
    console.error("❌ Full error:", error);
  } finally {
    // Close browser if it was created
    if (browser) {
      await browser.close();
      console.log("🔒 Browser closed");
    }
  }
}

// Run the test
testLinkedIn().catch(console.error);
