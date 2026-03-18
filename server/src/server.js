const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const placesRoutes = require('./routes/places');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS for Expo development
app.use(cors({
    origin: function (origin, callback) {
        // Allowing requests with no origin
        if (!origin) return callback(null, true);

        // Allowing all Expo development origins
        if (
            origin.includes('exp://') ||
            origin.includes('localhost:') ||
            origin.includes('192.168.') ||
            origin.includes('127.0.0.1:')
        ) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/places', placesRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.use(errorHandler);

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl
    });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Accessible at: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        console.error('Stop the other backend process or change PORT in server/.env.');
        process.exit(1);
    }

    throw error;
});
