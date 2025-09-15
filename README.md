# BrowserBot - LinkedIn Automation Suite

A powerful browser automation tool that can login to LinkedIn, search for people, and extract profile information - all without using APIs. Perfect for CRM automation and lead generation.

## 🚀 Features

- **Smart Login**: Human-like login automation with cookie persistence
- **People Search**: Search LinkedIn for specific terms and extract profile data
- **Profile Extraction**: Click on profiles and extract LinkedIn usernames
- **Cookie Management**: Saves login session to avoid repeated logins
- **Screenshot Documentation**: Takes screenshots at each step for verification
- **Error Handling**: Robust error handling and recovery mechanisms

## 🛠️ Technology Stack

- **JavaScript/Node.js** - Main programming language
- **Puppeteer** - Browser automation library
- **ES Modules** - Modern JavaScript module system
- **Environment Variables** - Secure credential management

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd no_api_automation
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your credentials:
   ```bash
   # Create .env file with your LinkedIn credentials
   echo "LINKEDIN_EMAIL=your-email@example.com" > .env
   echo "LINKEDIN_PASSWORD=your-password" >> .env
   ```

## 🎯 Usage

### LinkedIn Search & Profile Extraction

```bash
npm run search
```

Searches for "web development agency" and extracts LinkedIn usernames from the first 5 profiles.

The script will:

1. Launch a browser
2. Login to LinkedIn (with cookie persistence)
3. Search for "web development agency"
4. Click on the first 5 profiles
5. Extract and display their LinkedIn usernames

## 📁 Project Structure

```
├── linkedin-search.js     # Main search and profile extraction script
├── config.js             # Configuration settings
├── package.json          # Dependencies and scripts
├── .env                  # Your credentials (not in git)
├── cookies.json          # Saved login session (not in git)
└── screenshots/          # Screenshots from automation
```

## 🔧 Configuration

Edit `config.js` to customize:

- Browser settings (headless mode, viewport size)
- Timing delays between actions
- LinkedIn URLs and endpoints
- Screenshot and file paths

## 🍪 Cookie Persistence

The system automatically saves your login session in `cookies.json`. This means:

- ✅ No need to login every time
- ✅ Faster subsequent runs
- ✅ More human-like behavior
- ✅ Reduced chance of triggering security measures

## 📸 Screenshots

The automation takes screenshots at key moments:

- `linkedin-before-login.png` - Login form filled
- `linkedin-after-login.png` - After successful login
- `linkedin-search-results.png` - Search results page
- `linkedin-login-failed.png` - If login fails

## 🎯 Example Output

```
🎯 EXTRACTED NAMES:
==================
1. ed-lapins
2. danielwebdev
3. arturs-mackevics
4. webdevelopmentagency
5. pyordanov
==================

🎉 Successfully extracted 5 LinkedIn names!
```

## 🚀 Next Steps

- [x] ✅ Project setup and browser automation
- [x] ✅ LinkedIn login automation
- [x] ✅ Profile search and extraction
- [x] ✅ Cookie persistence
- [ ] 🔄 Customize search terms
- [ ] 🔄 Extract more profile data (name, title, company)
- [ ] 🔄 Export results to CSV/JSON
- [ ] 🔄 Cloud deployment (like Dripify)

## ⚠️ Important Notes

- This tool is for educational and legitimate business purposes only
- Respect LinkedIn's Terms of Service
- Use reasonable delays between actions to avoid detection
- The automation mimics human behavior to reduce bot detection
- Always test with small numbers first

## 🤝 Contributing

This is a learning project. Feel free to:

- Add new automation features
- Improve error handling
- Add support for other websites
- Optimize performance

## 📄 License

MIT License - Use responsibly and ethically.
