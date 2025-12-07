"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_FEATURES = exports.PAGINATION = exports.JWT_CONFIG = exports.TMDB_CONFIG = exports.APP_CONFIG = void 0;
exports.APP_CONFIG = {
    NAME: 'Netflix Max',
    VERSION: '1.0.0',
    API_PREFIX: '/api/v1',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
exports.TMDB_CONFIG = {
    API_KEY: process.env.TMDB_API_KEY,
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
};
exports.JWT_CONFIG = {
    SECRET: process.env.JWT_SECRET || 'your-secret-key',
    EXPIRES_IN: '7d',
    REFRESH_EXPIRES_IN: '30d',
};
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
exports.SUBSCRIPTION_FEATURES = {
    basic: {
        maxDevices: 1,
        quality: 'SD',
        hasMax: false,
    },
    standard: {
        maxDevices: 2,
        quality: 'HD',
        hasMax: false,
    },
    premium: {
        maxDevices: 4,
        quality: '4K',
        hasMax: false,
    },
    max: {
        maxDevices: 4,
        quality: '4K',
        hasMax: true,
    },
};
//# sourceMappingURL=constants.js.map