import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { USE_MOCK } from './config';

// Initialize with rich mock data (Master Copy)
let localVendors = [
    {
        id: 'V-001',
        name: 'Meenakshi Polymers Pvt Ltd',
        type: 'Pvt Ltd',
        city: 'New Delhi',
        status: 'Active',
        contact: 'Rajesh Kumar',
        email: 'rajesh@meenakshi.com',
        phone: '9876543210',
        address: {
            street: 'Plot No. 45, Okhla Industrial Estate',
            state: 'Delhi',
            zip: '110020',
            country: 'India'
        },
        tax: {
            pan: 'ABCDE1234F',
            gst: '07ABCDE1234F1Z1'
        },
        bank: {
            name: 'HDFC Bank',
            account: '1234567890',
            ifsc: 'HDFC0001234'
        }
    },
    {
        id: 'V-002',
        name: 'NeoSky India Ltd',
        type: 'Ltd',
        city: 'Bangalore',
        status: 'Blocked',
        contact: 'Amit Singh',
        email: 'amit@neosky.in',
        phone: '9876543211',
        address: {
            street: 'Tech Park, Whitefield',
            state: 'Karnataka',
            zip: '560066',
            country: 'India'
        },
        tax: {
            pan: 'FGHIJ5678K',
            gst: '29FGHIJ5678K1Z5'
        },
        bank: {
            name: 'ICICI Bank',
            account: '0987654321',
            ifsc: 'ICIC0005678'
        }
    },
    {
        id: 'V-003',
        name: 'Alpha Tech Components',
        type: 'Proprietorship',
        city: 'Pune',
        status: 'Active',
        contact: 'Sneha Gupta',
        email: 'sneha@alphatech.com',
        phone: '9876543212',
        address: {
            street: 'MIDC Chakan',
            state: 'Maharashtra',
            zip: '410501',
            country: 'India'
        },
        tax: {
            pan: 'KLMNO9012P',
            gst: '27KLMNO9012P1Z2'
        },
        bank: {
            name: 'SBI',
            account: '1122334455',
            ifsc: 'SBIN0001122'
        }
    },
    {
        id: 'V-004',
        name: 'GreenCell Batteries',
        type: 'Pvt Ltd',
        city: 'Chennai',
        status: 'Active',
        contact: 'Karthik R',
        email: 'karthik@greencell.com',
        phone: '9876543213',
        address: {
            street: 'Guindy Industrial Estate',
            state: 'Tamil Nadu',
            zip: '600032',
            country: 'India'
        },
        tax: {
            pan: 'PQRST3456U',
            gst: '33PQRST3456U1Z8'
        },
        bank: {
            name: 'Axis Bank',
            account: '5566778899',
            ifsc: 'UTIB0003344'
        }
    },
    {
        id: 'V-005',
        name: 'MetalWorks Industries',
        type: 'Pvt Ltd',
        city: 'Ludhiana',
        status: 'Pending',
        contact: 'Jaskaran Singh',
        email: 'jas@metalworks.com',
        phone: '9876543214',
        address: {
            street: 'Focal Point',
            state: 'Punjab',
            zip: '141010',
            country: 'India'
        },
        tax: {
            pan: 'VWXYZ7890A',
            gst: '03VWXYZ7890A1Z9'
        },
        bank: {
            name: 'Punjab National Bank',
            account: '9988776655',
            ifsc: 'PUNB0005566'
        }
    },
];

export const vendorService = {
    getAllVendors: async () => {
        if (USE_MOCK) return Promise.resolve([...localVendors]); // Return copy
        const response = await apiClient.get(ENDPOINTS.VENDORS.LIST);
        return response.data;
    },

    getVendorById: async (id) => {
        if (USE_MOCK) {
            const vendor = localVendors.find(v => v.id === id);
            return Promise.resolve(vendor ? { ...vendor } : null);
        }
        // api call normally
    },

    updateVendor: async (updatedVendor) => {
        if (USE_MOCK) {
            localVendors = localVendors.map(v =>
                v.id === updatedVendor.id ? { ...v, ...updatedVendor } : v
            );
            return Promise.resolve(updatedVendor);
        }
        // api call
    },

    createVendor: async (vendorData) => {
        if (USE_MOCK) {
            const newVendor = { ...vendorData, id: `V-00${localVendors.length + 1}`, status: 'Pending' };
            localVendors.push(newVendor);
            return Promise.resolve(newVendor);
        }
        const response = await apiClient.post(ENDPOINTS.VENDORS.CREATE, vendorData);
        return response.data;
    },

    getVendorHistory: async (vendorId) => {
        if (USE_MOCK) {
            // Mock History Logic
            const history = [
                { id: 1, vendorId: 'V-001', name: 'CNC Machine Tool #12', date: '15 Nov 2024', status: 'Initial setup', type: 'Tool' },
                { id: 2, vendorId: 'V-001', name: 'Testing Equipment T-45', date: '20 Nov 2024', status: 'Quality testing', type: 'Tool' },
                { id: 3, vendorId: 'V-001', name: 'Production Line A', date: '15 Nov 2024', status: 'Initial setup', type: 'Allotment' },
                { id: 4, vendorId: 'V-002', name: 'Oscilloscope X-200', date: '10 Dec 2024', status: 'Calibration', type: 'Tool' },
                { id: 5, vendorId: 'V-002', name: 'Assembly Station B2', date: '12 Dec 2024', status: 'Active', type: 'Allotment' }
            ];
            return Promise.resolve(history.filter(h => h.vendorId === vendorId));
        }
        const response = await apiClient.get(ENDPOINTS.VENDORS.TRANSACTIONS(vendorId));
        return response.data;
    },

    getVendorComponents: async (vendorId) => {
        if (USE_MOCK) {
            const components = [
                // V-001 Meenakshi Polymers
                { id: 'C-101', vendorId: 'V-001', name: 'Polymer Casing Type-A', category: 'Plastics', sor: 'SOR-MOLD-001', stock: 450, status: 'Active' },
                { id: 'C-102', vendorId: 'V-001', name: 'Rubber Gasket Seal', category: 'Rubber', sor: 'SOR-SEAL-022', stock: 1200, status: 'Active' },
                // V-002 NeoSky India
                { id: 'C-201', vendorId: 'V-002', name: 'BLDC Motor Controller', category: 'Electronics', sor: 'SOR-ELE-101', stock: 85, status: 'Active' },
                { id: 'C-202', vendorId: 'V-002', name: 'Li-Ion Battery Pack 48V', category: 'Battery', sor: 'SOR-BAT-005', stock: 40, status: 'Pending' },
            ];
            return Promise.resolve(components.filter(c => c.vendorId === vendorId));
        }
        // api call
    },

    getVendorDocuments: async (vendorId) => {
        if (USE_MOCK) {
            const documents = [
                // V-001
                { id: 1, vendorId: 'V-001', name: 'NDA_Meenakshi_2024.pdf', type: 'NDA', status: 'Uploaded' },
                { id: 2, vendorId: 'V-001', name: 'GST_Certificate.pdf', type: 'Compliance', status: 'Uploaded' },
                // V-002
                { id: 3, vendorId: 'V-002', name: 'NDA_NeoSky_Signed.pdf', type: 'NDA', status: 'Uploaded' },
                { id: 4, vendorId: 'V-002', name: 'ISO_9001_Cert.jpg', type: 'Compliance', status: 'Uploaded' }
            ];
            return Promise.resolve(documents.filter(d => d.vendorId === vendorId));
        }
        // api call
    }
};
