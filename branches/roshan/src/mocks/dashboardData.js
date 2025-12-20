// Mock Data for Dashboard
export const mockDashboardMetrics = {
    totalModels: 5,
    totalComponents: 120,
    totalStockLevel: 5000
};

export const mockInventoryChartData = [
    { name: 'Jan', Received: 400, Dispatched: 240 },
    { name: 'Feb', Received: 300, Dispatched: 139 },
    { name: 'Mar', Received: 200, Dispatched: 980 },
    { name: 'Apr', Received: 278, Dispatched: 390 },
    { name: 'May', Received: 189, Dispatched: 480 },
    { name: 'Jun', Received: 239, Dispatched: 380 },
    { name: 'Jul', Received: 349, Dispatched: 430 },
    { name: 'Aug', Received: 200, Dispatched: 200 },
    { name: 'Sep', Received: 278, Dispatched: 390 },
    { name: 'Oct', Received: 189, Dispatched: 480 },
    { name: 'Nov', Received: 1500, Dispatched: 1455 },
    { name: 'Dec', Received: 349, Dispatched: 430 },
];

export const mockStockDistributionData = [
    { name: 'FRONT WHEEL BEARING', value: 30 },
    { name: 'REAR SUSPENSION', value: 25 },
    { name: 'BRAKE PADS', value: 20 },
    { name: 'HEADLIGHT ASSEMBLY', value: 25 },
];

export const mockLowStockItems = [
    { name: 'FRONT WHEEL BEARING', stock: 5 },
    { name: 'OIL FILTER', stock: 2 }
];
