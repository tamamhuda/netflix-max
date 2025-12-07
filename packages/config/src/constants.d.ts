export declare const APP_CONFIG: {
    NAME: string;
    VERSION: string;
    API_PREFIX: string;
    CORS_ORIGIN: string;
};
export declare const TMDB_CONFIG: {
    API_KEY: string;
    BASE_URL: string;
    IMAGE_BASE_URL: string;
};
export declare const JWT_CONFIG: {
    SECRET: string;
    EXPIRES_IN: string;
    REFRESH_EXPIRES_IN: string;
};
export declare const PAGINATION: {
    DEFAULT_PAGE: number;
    DEFAULT_LIMIT: number;
    MAX_LIMIT: number;
};
export declare const SUBSCRIPTION_FEATURES: {
    basic: {
        maxDevices: number;
        quality: string;
        hasMax: boolean;
    };
    standard: {
        maxDevices: number;
        quality: string;
        hasMax: boolean;
    };
    premium: {
        maxDevices: number;
        quality: string;
        hasMax: boolean;
    };
    max: {
        maxDevices: number;
        quality: string;
        hasMax: boolean;
    };
};
