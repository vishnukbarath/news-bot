# WhatsApp News Bot

A simple and user-friendly WhatsApp bot that delivers the latest news from various categories. Built with Node.js and the Baileys API.

## Features

- 📰 Get latest news from 7 different categories
- 🔄 Paginated news display (3 articles at a time)
- 🖼️ News articles with images (when available)
- 📅 Clean date formatting
- 🎯 Simple number-based menu system

## News Categories

1. General News
2. Business News
3. Technology News
4. Sports News
5. Entertainment News
6. Health News
7. Science News

## How to Use

1. **Start the Bot**
   - Run `npm start`
   - Scan the QR code with WhatsApp
   - The bot will be ready to use

2. **Getting News**
   - Send any message to the bot
   - You'll see a menu with numbered categories
   - Type the number (1-7) of the category you want to read

3. **Reading More News**
   - After seeing the first 3 articles
   - Type the same number again to see the next set
   - Type 'menu' anytime to return to categories

## Example Interaction

```
You: hi
Bot: 📰 News Categories

1. General News
2. Business News
3. Technology News
4. Sports News
5. Entertainment News
6. Health News
7. Science News

Type the number of your choice (1-7)

You: 3
Bot: Fetching technology news...
[Shows 3 technology news articles with images]

Bot: Type the same number (3) to see more news, or type 'menu' to see categories.

You: 3
Bot: [Shows next 3 technology news articles]

You: menu
Bot: [Shows category menu again]
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Key**
   - Get your API key from [NewsData.io](https://newsdata.io/)
   - Add your API key to `config.js`

3. **Start the Bot**
   ```bash
   npm start
   ```

## Technical Details

- Built with Node.js
- Uses Baileys for WhatsApp integration
- News data from NewsData.io API
- Supports image display for news articles
- Maintains user state for pagination

## Error Handling

- If images fail to load, the bot will show text-only articles
- If a category has no news, you'll be prompted to try another
- If there's an error, you'll get a friendly message to try again

## Tips

- Type 'menu' anytime to return to the main categories
- Each category shows 3 articles at a time
- Keep typing the same number to see more articles in that category
- Images are included when available from the news source

## Support

If you encounter any issues:
1. Check your internet connection
2. Verify your API key is correct
3. Ensure all dependencies are installed
4. Check the console for error messages 