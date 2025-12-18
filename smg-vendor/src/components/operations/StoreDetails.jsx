import React from 'react';
import { Package, MapPin, AlertTriangle, Box } from 'lucide-react';

const mockStoreItems = [
    { id: 1, bin: 'A-12', itemCode: 'EL-001-RX', name: 'Resistor 10k', quantity: 1500, minLevel: 500, category: 'Electronics' },
    { id: 2, bin: 'B-05', itemCode: 'HW-102-BL', name: 'M4 Bolts', quantity: 45, minLevel: 100, category: 'Hardware' },
    { id: 3, bin: 'C-08', itemCode: 'PL-550-CS', name: 'Plastic Casing', quantity: 300, minLevel: 100, category: 'Enclosure' },
    { id: 4, bin: 'A-15', itemCode: 'EL-022-CP', name: 'Capacitor 47uF', quantity: 800, minLevel: 200, category: 'Electronics' },
    { id: 5, bin: 'D-01', itemCode: 'PK-999-BX', name: 'Shipping Box L', quantity: 20, minLevel: 50, category: 'Packaging' },
];

const StoreDetails = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#1B365D] flex items-center gap-2">
                    <Package className="text-[#1B365D]" size={24} />
                    Store / Bin Details
                </h2>
                <p className="text-gray-500 text-sm mt-1">Inventory levels and bin locations</p>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockStoreItems.map((item) => (
                        <div key={item.id} className="p-4 rounded-lg border border-gray-100 hover:border-[#1B365D]/30 hover:shadow-md transition-all group bg-gray-50/50">
                            <div className="flex justify-between items-start mb-3">
                                <div className="bg-white p-2 rounded-md shadow-sm text-[#1B365D]">
                                    <Box size={20} />
                                </div>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">
                                    {item.bin}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                            <p className="text-xs text-gray-500 mb-4 font-mono">{item.itemCode}</p>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Quantity</p>
                                    <p className={`text-2xl font-bold ${item.quantity < item.minLevel ? 'text-red-600' : 'text-[#1B365D]'}`}>
                                        {item.quantity}
                                    </p>
                                </div>
                                {item.quantity < item.minLevel && (
                                    <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded text-xs font-medium">
                                        <AlertTriangle size={12} />
                                        Low Stock
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoreDetails;
