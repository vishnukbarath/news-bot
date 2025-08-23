const axios = require('axios')
const config = require('../config')

class NewsFetcher {
    constructor() {
        this.apiKey = config.NEWS_API_KEY
        this.baseUrl = config.NEWS_API_BASE_URL
    }

    async getTopHeadlines(category = 'general', country = config.DEFAULT_COUNTRY) {
        try {
            const response = await axios.get(`${this.baseUrl}/news`, {
                params: {
                    apikey: this.apiKey,
                    country,
                    category,
                    language: config.DEFAULT_LANGUAGE,
                    size: config.DEFAULT_PAGE_SIZE
                }
            })

            return response.data.results
        } catch (error) {
            console.error('Error fetching news:', error.message)
            throw new Error('Failed to fetch news. Please try again later.')
        }
    }

    async searchNews(query) {
        try {
            const response = await axios.get(`${this.baseUrl}/news`, {
                params: {
                    apikey: this.apiKey,
                    q: query,
                    language: config.DEFAULT_LANGUAGE,
                    size: config.DEFAULT_PAGE_SIZE
                }
            })

            return response.data.results
        } catch (error) {
            console.error('Error searching news:', error.message)
            throw new Error('Failed to search news. Please try again later.')
        }
    }

    formatNewsArticle(article) {
        return {
            title: article.title,
            description: article.description || 'No description available',
            url: article.link,
            source: article.source_id,
            publishedAt: new Date(article.pubDate).toLocaleString(),
            imageUrl: article.image_url || article.image || null
        }
    }
}

module.exports = new NewsFetcher() 