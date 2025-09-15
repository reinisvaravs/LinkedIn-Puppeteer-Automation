import puppeteer from "puppeteer";
import config from "./config.js";

async function main() {
  console.log("🚀 CRM Automation System Starting...");
  console.log(
    "📋 Configuration loaded:",
    config.browser.headless ? "Headless mode" : "Visible browser"
  );

  // This is where your main automation logic will go
  // For now, we'll just show that ES modules are working
  console.log("✅ ES modules are working correctly!");
  console.log("🔧 Ready for automation tasks...");
}

// Run the main function
main().catch(console.error);
