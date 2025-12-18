import React, { createContext, useState } from "react";

export const VendorFormContext = createContext();

export function VendorFormProvider({ children }) {
  const [formData, setFormData] = useState({

    /* =====================================================
       PAGE 1 — VENDOR ONBOARDING (VENDOR FILLS)
    ===================================================== */

    // Document Control
    code: "",
    revisionDate: "",
    revisionStatus: "",

    // 1. Supplier
    salutation: "",
    supplierName: "",

    // 2. Address
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    nearestRailway: "",
    nearestAirport: "",

    // 3. Currency
    currency: "INR",

    // 4. Payment Terms
    paymentTerms: "",

    // 5–8 Contact Details
    contactPerson: "",
    designation: "",
    phoneStd: "",
    faxNo: "",
    mobileNo: "",
    email: "",
    altEmail: "",

    // 8A GST Contact
    gstContactNo: "",
    gstEmail: "",

    // 9 Bank Details
    bankName: "",
    ifscCode: "",
    accountNumber: "",
    bankProofPdf: [],

    // 10 Vendor Status
    proprietor: false,
    ltd: false,
    co: false,
    partnership: false,

    // 11 Industrial Status
    micro: false,
    small: false,
    medium: false,
    large: false,
    notApplicable: false,

    // 12 Staff Strength
    staffSales: "",
    staffService: "",
    staffOthers: "",
    staffTotal: "",

    // 13 Dealer / Distributor
    dealerDistributorBrand: "",

    // 14 Product Range
    productRange: "",

    // 15 PAN
    panNo: "",
    panPdf: [],

    // 16 GST
    gstNo: "",
    gstPdf: [],

    // 17 GST Vendor Class
    gstRegistered: false,
    gstNotRegistered: false,
    gstComposition: false,
    gstGovtOrg: false,

    // 18 TAN
    tanNo: "",
    tanPdf: [],

    // 19 Registered with SMG
    registeredWithSMG: "", // YES / NO
    prevVendorCode: "",
    prevVendorAddress: "",

    // 20 Mode of Material Supply
    supplyByRoad: false,
    supplyByCourier: false,
    supplyOther: false,

    // 21 Mode of Transport
    transportMode: "",

    // Vendor Declaration
    vendorSignaturePdf: [],


    /* =====================================================
       PAGE 2 / 3 — ACCOUNTING DEPARTMENT
    ===================================================== */

    // 22 Type of Business
    typeOfBusiness: "",
    houseBank: "",

    // 23–25 Payment / Tax
    paymentMode: "",
    withholdingTaxType: "",
    withholdingTaxCode: "",
    receiptType: "COMPANY",

    // 26 Vendor Recommendation
    vendorRecommendation: "",

    // 27 Existing Vendor
    existingVendorName: "",
    existingVendorCode: "",
    vendorBlocked: "",

    // 28 Reasons for Selecting Vendor
    reasonVendor1: "",
    reasonVendor2: "",
    reasonVendor3: "",

    // 29 Reasons for Service Provider
    reasonService1: "",
    reasonService2: "",
    reasonService3: "",

    // 30–33 Vendor Creation
    departmentName: "",
    vendorNameStep3: "",
    vendorCodeStep3: "",
    requestDate: "",
    createdBy: "",
    creationDate: "",

    // Purchase Organization
    poSESL: false,
    poP001: false,
    poP002: false,

    // Category
    Capex: false,
    "Repair & Maintenance": false,
    "Consult / Sub-Contract": false,
    Contractors: false,
    "Transport / Logistics": false,
    General: false,
    Consumables: false,
    "Dealer / Salesman": false,
    "Misc Purchase": false,

    // Self Declaration
    selfDeclaredBy: "",

    // Signature (Accounting)
    signaturePdfStep3: [],

    // Prepared / Approved
    preparedByName: "",
    preparedByContact: "",
    deptHeadName: "",
    deptHeadContact: "",
  });

  /* =====================================================
     UPDATE HANDLER
  ===================================================== */
  const update = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =====================================================
     RESET (OPTIONAL)
  ===================================================== */
  const reset = () => {
    setFormData({});
  };

  return (
    <VendorFormContext.Provider value={{ formData, update, reset }}>
      {children}
    </VendorFormContext.Provider>
  );
}
