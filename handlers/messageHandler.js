const config = require('../config');
const newsFetcher = require('../services/newsFetcher');
const { createMainMenuButtons, getButtonsMessage } = require('../utils/buttonTemplates');

// Store user states and pagination
const userStates = new Map();

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatNewsArticle(article) {
    const title = article.title || 'No Title Available';
    const description = article.description || 'No description available';
    const source = article.source_id || article.source?.name || 'Unknown Source';
    const date = formatDate(article.pubDate || article.publishedAt);
    const url = article.link || article.url;
    const imageUrl = article.image_url || article.image;

    return {
        title,
        description,
        source,
        date,
        url,
        imageUrl
    };
}

async function sendMenu(sock, from) {
    const menuText = `📰 *News Categories*\n\n` +
        `1. General News\n` +
        `2. Business News\n` +
        `3. Technology News\n` +
        `4. Sports News\n` +
        `5. Entertainment News\n` +
        `6. Health News\n` +
        `7. Science News\n\n` +
        `Type the number of your choice (1-7)`;

    await sock.sendMessage(from, { text: menuText });
}

async function handleMessage(sock, message) {
    const from = message.key.remoteJid;
    const content = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
    const input = content.trim().toLowerCase();

    // Initialize user state if not exists
    if (!userStates.has(from)) {
        userStates.set(from, { page: 1 });
    }

    const userState = userStates.get(from);

    // Handle menu command
    if (input === 'menu') {
        userState.page = 1;
        await sendMenu(sock, from);
        return;
    }

    // Handle category selection
    const categoryMap = {
        '1': 'general',
        '2': 'business',
        '3': 'technology',
        '4': 'sports',
        '5': 'entertainment',
        '6': 'health',
        '7': 'science'
    };

    if (categoryMap[input]) {
        const category = categoryMap[input];
        try {
            // Send loading message
            await sock.sendMessage(from, { text: `Fetching ${category} news...` });

            // Get news articles with pagination
            const articles = await newsFetcher.getTopHeadlines(category);
            
            if (!articles || articles.length === 0) {
                await sock.sendMessage(from, { 
                    text: `No news found for ${category}. Try another category!`
                });
                await sendMenu(sock, from);
                return;
            }

            // Calculate pagination
            const articlesPerPage = 3;
            const startIndex = (userState.page - 1) * articlesPerPage;
            const endIndex = startIndex + articlesPerPage;
            const currentArticles = articles.slice(startIndex, endIndex);

            // Send category header
            await sock.sendMessage(from, {
                text: `*${category.charAt(0).toUpperCase() + category.slice(1)} News*\n` +
                      `Page ${userState.page} of ${Math.ceil(articles.length / articlesPerPage)}`
            });

            // Send each article
            for (const article of currentArticles) {
                const formatted = formatNewsArticle(article);
                
                // Try to send with image
                if (formatted.imageUrl) {
                    try {
                        await sock.sendMessage(from, {
                            image: { url: formatted.imageUrl },
                            caption: `*${formatted.title}*\n\n` +
                                    `${formatted.description}\n\n` +
                                    `Source: ${formatted.source}\n` +
                                    `Published: ${formatted.date}\n` +
                                    `Read more: ${formatted.url}`
                        });
                    } catch (error) {
                        // Fallback to text-only if image fails
                        await sock.sendMessage(from, {
                            text: `*${formatted.title}*\n\n` +
                                  `${formatted.description}\n\n` +
                                  `Source: ${formatted.source}\n` +
                                  `Published: ${formatted.date}\n` +
                                  `Read more: ${formatted.url}`
                        });
                    }
                } else {
                    // Send text-only message
                    await sock.sendMessage(from, {
                        text: `*${formatted.title}*\n\n` +
                              `${formatted.description}\n\n` +
                              `Source: ${formatted.source}\n` +
                              `Published: ${formatted.date}\n` +
                              `Read more: ${formatted.url}`
                    });
                }
            }

            // Update page number for next request
            if (endIndex < articles.length) {
                userState.page++;
                await sock.sendMessage(from, {
                    text: `Type the same number (${input}) to see more news, or type 'menu' to see categories.`
                });
            } else {
                userState.page = 1;
                await sock.sendMessage(from, {
                    text: `No more news in this category. Type 'menu' to see categories.`
                });
            }

        } catch (error) {
            console.error('Error handling news request:', error);
            await sock.sendMessage(from, {
                text: 'Sorry, there was an error fetching the news. Please try again!'
            });
            await sendMenu(sock, from);
        }
    } else {
        // Invalid input - show menu
        await sendMenu(sock, from);
    }
}

module.exports = { handleMessage }; 