const { app, connectDB } = require('../src/app');

module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error('Vercel API error:', error);

        if (!res.headersSent) {
            return res.status(503).json({
                success: false,
                message: 'Service temporarily unavailable'
            });
        }
    }
};