export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        ME: '/auth/me'
    },
    DASHBOARD: {
        METRICS: '/dashboard/metrics',
        INVENTORY_CHART: '/dashboard/inventory-chart',
        STOCK_DISTRIBUTION: '/dashboard/stock-distribution',
        LOW_STOCK: '/dashboard/low-stock'
    },
    VENDORS: {
        LIST: '/vendors',
        DETAILS: (id) => `/vendors/${id}`,
        CREATE: '/vendors',
        TRANSACTIONS: (id) => `/vendors/${id}/transactions`
    },
    MATERIALS: {
        RECEIVE: '/materials/receive',
        DISPATCH: '/materials/dispatch',
        HISTORY_RECEIVE: '/materials/history/receive',
        HISTORY_DISPATCH: '/materials/history/dispatch'
    },
    MODELS: {
        LIST: '/models'
    },
    COMPONENTS: {
        LIST: '/components'
    },
    INVENTORY: {
        LIST: '/inventory'
    },
    PRODUCTION: {
        HISTORY: '/production/history',
        GENERATE: '/production/generate'
    },
    FORECASTING: {
        GENERATE: '/forecasting/generate'
    },
    ADMIN: {
        USERS: '/admin/users',
        CREATE_USER: '/admin/users'
    }
};
