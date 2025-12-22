// Mock Database for SOR Records
export const sorRecords = [
    {
        id: "SOR-ELEC-001",
        title: "ECU Module - Gen 5 Specifications",
        vendor: "Bosch Automotive",
        status: "Active",
        companyDetails: [
            { label: "Company Name", value: "Bosch Automotive", key: "companyName" },
            { label: "Enquirer Name & Designation", value: "Rahul Verma - Sr. Purchaser", key: "enquirer" },
            { label: "Contact No & Email Address", value: "+91 9876543210 | rahul.v@bosch.com", key: "contact" },
            { label: "Nature of Company", value: "OEM Supplier", key: "nature" },
            { label: "Key Account Manager", value: "Amit Singh", key: "kam" },
            { label: "Date of Enquiry", value: "2024-12-20", key: "date" },
            { label: "Document No.", value: "SOR-ELEC-001", key: "docNo" },
            { label: "Revision Status", value: "Rev 1.2", key: "rev" },
        ],
        technicalSpecs: [
            { id: 1, param: "Operating Voltage", standard: "12V - 48V DC", supplier: "12V - 48V DC", remarks: "Standard Compliant" },
            { id: 2, param: "IP Rating", standard: "IP67", supplier: "IP67", remarks: "Certified" },
            { id: 3, param: "CAN Bus Protocol", standard: "CAN 2.0B", supplier: "CAN 2.0B", remarks: "Tested" },
            { id: 4, param: "Connector Type", standard: "Automotive Grade 12-Pin", supplier: "Deutsch DT Series", remarks: "Images Attached" },
        ],
        terms: [
            { label: "Warranty Conditions", value: "2 Years Standard Warranty from date of delivery.", key: "warranty" },
            { label: "Replacement Conditions", value: "Immediate replacement for DOA (Dead on Arrival) units.", key: "replacement" },
            { label: "Sample Conditions", value: "5 Golden Samples required for PPAP approval.", key: "sample" },
            { label: "Return Policy", value: "Returns accepted for manufacturing defects within warranty period.", key: "return" },
            { label: "Negotiation Policy", value: "Annual price revision based on raw material index.", key: "negotiation" },
        ]
    },
    {
        id: "SOR-MECH-042",
        title: "Alloy Wheel Rims - 17 inch",
        vendor: "NeoSky India Ltd",
        status: "Draft",
        companyDetails: [
            { label: "Company Name", value: "NeoSky India Ltd", key: "companyName" },
            { label: "Enquirer Name & Designation", value: "Priya Das - Purchase Lead", key: "enquirer" },
            { label: "Contact No & Email Address", value: "priya.d@neosky.in", key: "contact" },
            { label: "Nature of Company", value: "Tier 1 Manufacturer", key: "nature" },
            { label: "Key Account Manager", value: "Vikram Malhotra", key: "kam" },
            { label: "Date of Enquiry", value: "2024-12-18", key: "date" },
            { label: "Document No.", value: "SOR-MECH-042", key: "docNo" },
            { label: "Revision Status", value: "Draft v0.1", key: "rev" },
        ],
        technicalSpecs: [],
        terms: []
    }
];

// Empty Template for New SORs / Replica
export const emptySorData = {
    companyDetails: [
        { label: "Company Name", value: "", key: "companyName" },
        { label: "Enquirer Name & Designation", value: "", key: "enquirer" },
        { label: "Contact No & Email Address", value: "", key: "contact" },
        { label: "Nature of Company", value: "", key: "nature" },
        { label: "Key Account Manager", value: "", key: "kam" },
        { label: "Date of Enquiry", value: "", key: "date" },
        { label: "Document No.", value: "", key: "docNo" },
        { label: "Revision Status", value: "", key: "rev" },
    ],
    technicalSpecs: [
        { id: 1, param: "", standard: "", supplier: "", remarks: "" }
    ],
    terms: [
        { label: "Warranty Conditions", value: "", key: "warranty" },
        { label: "Replacement Conditions", value: "", key: "replacement" },
        { label: "Sample Conditions", value: "", key: "sample" },
        { label: "Return Policy", value: "", key: "return" },
        { label: "Negotiation Policy", value: "", key: "negotiation" },
    ],
    accessories: {
        applicationDetails: [
            { label: "Vehicle Type / Model", value: "" },
            { label: "Technical Marketing Engineer", value: "" },
            { label: "Plant Location", value: "" },
        ],
        specifications: [
            { id: 1, spec: "", requirement: "", compliance: "", remarks: "" }
        ]
    }
};
