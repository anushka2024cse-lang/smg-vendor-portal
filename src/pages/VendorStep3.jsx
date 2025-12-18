import React, { useContext } from "react";
import { VendorFormContext } from "../context/VendorFormContext";
import AppLayout from "../components/AppLayout";
import PageCard from "../components/PageCard";
import FileUpload from "../components/FileUpload";
import { useNavigate } from "react-router-dom";

const labelCls = "text-xs font-medium text-gray-700 mb-1";
const inputCls =
  "w-full h-10 px-3 rounded-md border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3A63]";

export default function VendorStep3() {
  const { formData, update } = useContext(VendorFormContext);
  const nav = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("FINAL STEP-3 DATA:", formData);
    alert("Step-3 Submitted. Check console.");
  };

  return (
    <AppLayout>
      <PageCard>

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold">SMG ELECTRIC SCOOTERS LTD</h1>
          <h2 className="text-xl font-semibold">Vendor Onboard Form</h2>
          <p className="text-xs text-gray-500">
            (To be filled by Accounting Department)
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-10">

          {/* 22 TYPE OF BUSINESS */}
          <Section title="22. Type of Business">
            <Grid>
              <Input label="Type of Business" k="typeOfBusiness" />
              <Input label="House Bank (HDFC / ICICI)" k="houseBank" />
            </Grid>
          </Section>

          {/* PAYMENT & TAX */}
          <Section title="23–25. Payment & Tax">
            <Grid>
              <Input label="Payment Mode (DD / RTGS)" k="paymentMode" />
              <Input label="Withholding Tax Type" k="withholdingTaxType" />
              <Input label="Withholding Tax Code" k="withholdingTaxCode" />
              <Select
                label="Receipt Type"
                k="receiptType"
                options={["COMPANY", "OTHER"]}
              />
            </Grid>
          </Section>

          {/* 26 VENDOR RECOMMENDATION */}
          <Section title="26. Vendor Recommendation (Items / Services)">
            <textarea
              rows={3}
              className={`${inputCls} h-auto`}
              value={formData.vendorRecommendation || ""}
              onChange={(e) =>
                update("vendorRecommendation", e.target.value)
              }
            />
          </Section>

          {/* 27 EXISTING VENDOR */}
          <Section title="27. Existing Vendor (If any)">
            <Grid>
              <Input label="Existing Vendor Name" k="existingVendorName" />
              <Input label="Existing Vendor Code" k="existingVendorCode" />
              <Input label="Vendor to be Blocked (Yes / No)" k="vendorBlocked" />
            </Grid>
          </Section>

          {/* 28 & 29 REASONS */}
          <Section title="28–29. Reasons">
            <Grid cols={2}>
              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  Reasons for Selecting Vendor
                </p>
                {[1, 2, 3].map((i) => (
                  <Input
                    key={i}
                    placeholder={`Reason ${i}`}
                    k={`reasonVendor${i}`}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  Reasons for Service Provider
                </p>
                {[1, 2, 3].map((i) => (
                  <Input
                    key={i}
                    placeholder={`Reason ${i}`}
                    k={`reasonService${i}`}
                  />
                ))}
              </div>
            </Grid>
          </Section>

          {/* 30–33 VENDOR CREATION */}
          <Section title="30–33. Vendor Creation Details">
            <Grid>
              <Input label="Department Name" k="departmentName" />
              <Input label="Vendor Name" k="vendorNameStep3" />
              <Input label="Vendor Code (if any)" k="vendorCodeStep3" />
              <Input label="Request Date" type="date" k="requestDate" />
              <Input label="Created By (Cost Engineer)" k="createdBy" />
              <Input label="Creation Date" type="date" k="creationDate" />
            </Grid>
          </Section>

          {/* PURCHASE ORG */}
          <Section title="Purchase Organization">
            <Grid cols={3}>
              <Checkbox label="SESL" k="poSESL" />
              <Checkbox label="P001" k="poP001" />
              <Checkbox label="P002" k="poP002" />
            </Grid>
          </Section>

          {/* CATEGORY */}
          <Section title="Category (Select Specific)">
            <Grid cols={3}>
              {[
                "Capex",
                "Repair & Maintenance",
                "Consult / Sub-Contract",
                "Contractors",
                "Transport / Logistics",
                "General",
                "Consumables",
                "Dealer / Salesman",
                "Misc Purchase",
              ].map((c) => (
                <Checkbox key={c} label={c} k={c} />
              ))}
            </Grid>
          </Section>

          {/* SELF DECLARATION */}
          <Section title="Self Declaration">
            <Input label="Self Declared By (MR Name)" k="selfDeclaredBy" />
          </Section>

          {/* SIGNATURE */}
          <Section title="Signature">
            <FileUpload
              value={formData.signaturePdfStep3}
              onChange={(f) => update("signaturePdfStep3", f)}
              accept="application/pdf"
            />
          </Section>

          {/* PREPARED / APPROVED */}
          <Section title="Prepared & Approved">
            <Grid>
              <Input label="Prepared By – Name" k="preparedByName" />
              <Input label="Prepared By – Contact No" k="preparedByContact" />
              <Input label="Dept Head – Name" k="deptHeadName" />
              <Input label="Dept Head – Contact No" k="deptHeadContact" />
            </Grid>
          </Section>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => nav(-1)}
              className="h-10 px-4 border border-[#1F3A63] text-[#1F3A63] rounded-md"
            >
              Back
            </button>
            <button
              type="submit"
              className="h-10 px-6 bg-[#1F3A63] text-white rounded-md"
            >
              Submit
            </button>
          </div>

        </form>
      </PageCard>
    </AppLayout>
  );
}

/* ---------- SMALL HELPERS ---------- */

const Section = ({ title, children }) => (
  <div className="border rounded-lg p-6 bg-gray-50">
    <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const Grid = ({ cols = 2, children }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
    {children}
  </div>
);

const Input = ({ label, k, type = "text", placeholder }) => {
  const { formData, update } = useContext(VendorFormContext);
  return (
    <div>
      {label && <label className={labelCls}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className={inputCls}
        value={formData[k] || ""}
        onChange={(e) => update(k, e.target.value)}
      />
    </div>
  );
};

const Select = ({ label, options, k }) => {
  const { formData, update } = useContext(VendorFormContext);
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select
        className={inputCls}
        value={formData[k] || ""}
        onChange={(e) => update(k, e.target.value)}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
};

const Checkbox = ({ label, k }) => {
  const { formData, update } = useContext(VendorFormContext);
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={!!formData[k]}
        onChange={(e) => update(k, e.target.checked)}
      />
      {label}
    </label>
  );
};
