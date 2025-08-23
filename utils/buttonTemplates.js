const config = require('../config');

function getButtonsMessage() {
    return {
        text: "👋 Welcome to News Bot!\nChoose a category below:",
        footer: "Powered by NewsData.io",
        buttons: [
            { buttonId: 'general', buttonText: { displayText: '📰 General' }, type: 1 },
            { buttonId: 'business', buttonText: { displayText: '📈 Business' }, type: 1 },
            { buttonId: 'technology', buttonText: { displayText: '💻 Technology' }, type: 1 },
            { buttonId: 'sports', buttonText: { displayText: '⚽ Sports' }, type: 1 },
            { buttonId: 'entertainment', buttonText: { displayText: '🎬 Entertainment' }, type: 1 },
            { buttonId: 'health', buttonText: { displayText: '🏥 Health' }, type: 1 },
            { buttonId: 'science', buttonText: { displayText: '🔬 Science' }, type: 1 }
        ],
        headerType: 1
    }
}

module.exports = { getButtonsMessage } 