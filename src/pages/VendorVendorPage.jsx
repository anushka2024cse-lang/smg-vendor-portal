import React, { useContext } from "react";
import { VendorFormContext } from "../context/VendorFormContext";
import AppLayout from "../components/AppLayout";
import PageCard from "../components/PageCard";
import FileUpload from "../components/FileUpload";

export default function VendorVendorPage() {
  const { formData, update } = useContext(VendorFormContext);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted (console me data check karo)");
  };

  return (
    <AppLayout>
      <PageCard>
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-gray-900">
            SMG ELECTRIC SCOOTERS LTD
          </h1>
          <p className="text-lg font-medium">Vendor Onboarding Form</p>
          <p className="text-xs text-gray-500">
            (To be filled by Vendor in CAPITAL LETTERS)
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-10">

          {/* DOCUMENT CONTROL */}
          <Section title="Document Control">
            <Grid cols={3}>
              <Input label="Code" />
              <Input type="date" label="Revision Date" />
              <Input label="Revision Status" />
            </Grid>
          </Section>

          {/* 1. NAME OF SUPPLIER */}
          <Section title="1. Name of Supplier">
            <Grid cols={3}>
              <Select label="Company / Mr / Ms" options={["Company", "Mr", "Ms"]} />
              <Input label="Supplier Name (CAPITAL LETTERS)" span />
            </Grid>
          </Section>

          {/* 2. ADDRESS */}
          <Section title="2. Address">
            <Grid cols={3}>
              <Input label="House No" />
              <Input label="Street" />
              <Input label="City" />
              <Input label="State" />
              <Input label="Pin Code" />
              <Input label="Nearest Railway Station" />
              <Input label="Nearest Airport" span />
            </Grid>
          </Section>

          {/* 3. CURRENCY */}
          <Section title="3. Currency">
            <div className="flex gap-8">
              {["INR", "USD", "EURO"].map(c => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={formData.currency === c}
                    onChange={() => update("currency", c)}
                  />
                  {c}
                </label>
              ))}
            </div>
          </Section>

          {/* 4. PAYMENT TERMS */}
          <Section title="4. Payment Terms (V001)">
            <Input />
          </Section>

          {/* 5–8 CONTACT DETAILS */}
          <Section title="5–8. Contact Details">
            <Grid cols={3}>
              <Input label="Contact Person" />
              <Input label="Designation" />
              <Input label="Phone (STD Code)" />
              <Input label="Fax No" />
              <Input label="Mobile (Country Code)" />
              <Input label="Email ID" />
              <Input label="Alternate Email ID" />
            </Grid>
          </Section>

          {/* 8A GST CONTACT */}
          <Section title="8(A). Contact Details (Dedicated for GST)">
            <Grid cols={2}>
              <Input label="GST Contact No" />
              <Input label="GST Email ID" />
            </Grid>
          </Section>

          {/* 9 BANK DETAILS */}
          <Section title="9. Bank Details">
            <Grid cols={3}>
              <Input label="Bank Name" />
              <Input label="IFSC Code" />
              <Input label="Account Number" />
            </Grid>
            <FileUpload label="Cancelled Cheque (PDF)" />
          </Section>

          {/* 10 STATUS OF VENDOR */}
          <Section title="10. Status of Vendor">
            <Grid cols={5}>
              {["Proprietor", "Ltd", "Co", "Partnership"].map(v => (
                <Checkbox key={v} label={v} />
              ))}
            </Grid>
          </Section>

          {/* 11 INDUSTRIAL STATUS */}
          <Section title="11. Industrial Status">
            <Grid cols={5}>
              {["Micro", "Small", "Medium", "Large", "Not Applicable"].map(v => (
                <Checkbox key={v} label={v} />
              ))}
            </Grid>
          </Section>

          {/* 12 STAFF */}
          <Section title="12. No. of Staff">
            <Grid cols={4}>
              <Input label="In Sales" />
              <Input label="In Service" />
              <Input label="Others" />
              <Input label="Total" />
            </Grid>
          </Section>

          {/* 13 DEALER / DISTRIBUTOR */}
          <Section title="13. Dealer / Distributor">
            <Input label="Brand / Products / Items" />
          </Section>

          {/* 14 PRODUCT RANGE */}
          <Section title="14. Product Range">
            <Input label="Brand / Products / Items" />
          </Section>

          {/* 15 PAN */}
          <Section title="15. PAN">
            <Input label="PAN Number" />
            <FileUpload label="PAN Photocopy (PDF)" />
          </Section>

          {/* 16 GST */}
          <Section title="16. GST">
            <Input label="GST Number" />
            <FileUpload label="GST Registration (PDF)" />
          </Section>

          {/* 17 GST VENDOR CLASS */}
          <Section title="17. GST Vendor Class">
            <Grid cols={4}>
              {["Registered", "Not Registered", "Composition", "Govt Org"].map(v => (
                <Checkbox key={v} label={v} />
              ))}
            </Grid>
          </Section>

          {/* 18 TAN */}
          <Section title="18. TAN">
            <Input label="TAN Number" />
            <FileUpload label="TAN Photocopy (PDF)" />
          </Section>

          {/* 19 REGISTERED WITH SMG */}
          <Section title="19. Registered with SMG Electric">
            <Grid cols={2}>
              <Checkbox label="Yes" />
              <Checkbox label="No" />
            </Grid>
          </Section>

          {/* 20 MODE OF MATERIAL */}
          <Section title="20. Mode of Material Supply">
            <Grid cols={3}>
              {["By Road", "Courier", "Other"].map(v => (
                <Checkbox key={v} label={v} />
              ))}
            </Grid>
          </Section>

          {/* 21 TRANSPORT */}
          <Section title="21. Mode of Transport">
            <Input />
          </Section>

          {/* SIGNATURE */}
          <Section title="22. Signature of Vendor with Stamp">
            <FileUpload label="Signature (PDF)" />
          </Section>

          {/* SUBMIT */}
          <div className="flex justify-end pt-6">
            <button className="px-8 py-2 bg-[#1F3A63] text-white rounded-md">
              Submit
            </button>
          </div>
        </form>
      </PageCard>
    </AppLayout>
  );
}

/* ------------------ REUSABLE ------------------ */

const Section = ({ title, children }) => (
  <div className="border rounded-lg p-6 bg-gray-50">
    <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const Grid = ({ cols = 3, children }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
    {children}
  </div>
);

const Input = ({ label, type = "text", span }) => (
  <div className={span ? "md:col-span-2" : ""}>
    {label && <label className="text-sm text-gray-600">{label}</label>}
    <input type={type} className="vf-input mt-1 w-full" />
  </div>
);

const Select = ({ label, options }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <select className="vf-input mt-1 w-full">
      <option value="">Select</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const Checkbox = ({ label }) => (
  <label className="flex items-center gap-2 text-sm">
    <input type="checkbox" /> {label}
  </label>
);
