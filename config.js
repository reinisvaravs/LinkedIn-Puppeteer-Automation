// Configuration file for automation settings

export default {
  // Browser settings
  browser: {
    headless: process.env.NODE_ENV === "production" ? true : false, // Auto-detect cloud deployment
    slowMo: 1000, // Delay between actions (milliseconds)
    defaultViewport: null,
    args: [
      "--start-maximized",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor",
      "--single-process", // Required for some cloud environments
    ],
  },

  // LinkedIn settings
  linkedin: {
    baseUrl: "https://www.linkedin.com",
    loginUrl: "https://www.linkedin.com/login",
    // Add your LinkedIn credentials here (for testing)
    // email: 'your-email@example.com',
    // password: 'your-password'
  },

  // Timing settings
  timing: {
    pageLoadTimeout: 30000, // 30 seconds
    actionDelay: 2000, // 2 seconds between actions
    screenshotDelay: 5000, // 5 seconds before taking screenshots
  },

  // File paths
  paths: {
    screenshots: "./screenshots/",
    downloads: "./downloads/",
  },
};
