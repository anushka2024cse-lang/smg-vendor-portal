export const mockMaterialReceipts = [
    {
        id: 1,
        serialNo: 'SN-01',
        billNo: '10112025',
        partName: 'FRONT WHEEL BEARING',
        partCode: 'FWB-123',
        sapCode: 'SAP-78965',
        dateReceived: 'Nov 10, 2025',
        vendorName: 'RELIABLE PARTS CO.',
        units: 1500,
        pricePerUnit: '₹750.00',
        receivedBy: 'VIRENDRA SINGH',
        receivedAt: 'WAREHOUSE LUCKNOW',
        logistics: 'SMG',
        storeNo: 'S1',
        binNo: 'B-02',
        shelfNo: 'SH-10'
    }
];

export const mockMaterialDispatches = [
    {
        id: 1,
        serialNo: 'DSN-01',
        billNo: 'OUT-2022',
        partName: 'BRAKE PADS',
        partCode: 'BP-999',
        sapCode: 'SAP-111',
        dateDispatched: 'Dec 01, 2025',
        vendorName: 'AUTO COMPONENTS LTD', // Or client name if applicable
        unitsDispatched: 500,
        pricePerUnit: '₹200.00',
        dispatchedTo: 'Assembly Line 1',
        dispatchedAt: 'Factory Floor',
        hodName: 'Mike Ross',
        storeNo: 'S1',
        binNo: 'B-05',
        shelfNo: 'SH-12'
    }
];
