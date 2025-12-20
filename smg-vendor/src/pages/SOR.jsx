import React, { useState } from 'react';
import * as XLSX from "xlsx";

/* ---------------- ELECTRICAL SOR FORM ---------------- */

const electricalInitialState = {
  companyName: "",
  enquirerName: "",
  contactDetails: "",
  natureOfCompany: "",
  keyAccountManager: "",
  enquiryDate: "",
  docNo: "",
  revisionStatus: "",
  warrantyConditions: "",
  replacementConditions: "",
  sampleConditions: "",
  returnPolicy: "",
  negotiationPolicy: "",
};

function ElectricalSorForm() {
  const [form, setForm] = useState(electricalInitialState);
  const [rows, setRows] = useState([]); // dynamic technical rows
  const [savedMessage, setSavedMessage] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // multiple images per row
  const handleRowImageChange = (id, fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setRows((prev) =>
          prev.map((row) => {
            if (row.id !== id) return row;
            const images = row.images || [];
            return {
              ...row,
              images: [
                ...images,
                {
                  id: `${Date.now()}-${Math.random()}`,
                  name: file.name,
                  dataUrl,
                },
              ],
            };
          })
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        keyParameter: "",
        standard: "",
        supplier: "",
        remarks: "",
        images: [],
      },
    ]);
  };

  const handleDeleteRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...form, technicalRows: rows };

    try {
      localStorage.setItem("sor-electrical", JSON.stringify(payload));
    } catch (err) {
      console.error("Could not save electrical SOR", err);
    }

    setSnapshot(payload);
    setReviewOpen(true);
    setSavedMessage("Electrical SOR saved in this browser.");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <>
      <form className="sor-form" onSubmit={handleSubmit}>
        <h2 className="sor-title">
          Electrical Components – Technical Specification
        </h2>

        {/* COMPANY DETAILS */}
        <section className="sor-section">
          <div className="sor-section-header">
            Company Details &amp; Business Team
          </div>

          <div className="sor-grid sor-grid-2">
            <div className="sor-field">
              <label>Company Name</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Enquirer Name &amp; Designation</label>
              <input
                name="enquirerName"
                value={form.enquirerName}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Contact No &amp; Email Address</label>
              <input
                name="contactDetails"
                value={form.contactDetails}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Nature of Company</label>
              <input
                name="natureOfCompany"
                value={form.natureOfCompany}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Key Account Manager</label>
              <input
                name="keyAccountManager"
                value={form.keyAccountManager}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Date of Enquiry</label>
              <input
                type="date"
                name="enquiryDate"
                value={form.enquiryDate}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Document No.</label>
              <input
                name="docNo"
                value={form.docNo}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Revision Status</label>
              <input
                name="revisionStatus"
                value={form.revisionStatus}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* TECHNICAL SPEC TABLE */}
        <section className="sor-section">
          <div className="sor-section-header">Technical Specification</div>

          <div className="sor-table-like">
            <div className="sor-table-row sor-table-row--head">
              <div>Sl. No</div>
              <div>Key parameters</div>
              <div>SMG ELECTRIC SCOOTERS Standard</div>
              <div>SUPPLIER</div>
              <div>Remarks</div>
            </div>

            {rows.length === 0 && (
              <div className="sor-empty-row">
                No specification rows yet. Click{" "}
                <strong>“Add additional specification row”</strong> below.
              </div>
            )}

            {rows.map((row, index) => (
              <div className="sor-table-row" key={row.id}>
                <div>
                  {index + 1}
                  <button
                    type="button"
                    className="sor-row-delete-btn"
                    onClick={() => handleDeleteRow(row.id)}
                  >
                    ×
                  </button>
                </div>
                <div>
                  <textarea
                    placeholder="Key parameter"
                    value={row.keyParameter}
                    onChange={(e) =>
                      handleRowChange(row.id, "keyParameter", e.target.value)
                    }
                  />
                </div>
                <div>
                  <textarea
                    placeholder="SMG standard"
                    value={row.standard}
                    onChange={(e) =>
                      handleRowChange(row.id, "standard", e.target.value)
                    }
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Supplier value"
                    value={row.supplier}
                    onChange={(e) =>
                      handleRowChange(row.id, "supplier", e.target.value)
                    }
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Remarks"
                    value={row.remarks}
                    onChange={(e) =>
                      handleRowChange(row.id, "remarks", e.target.value)
                    }
                  />

                  <div className="sor-image-upload">
                    <label className="sor-image-label">
                      Attach images
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleRowImageChange(row.id, e.target.files)
                        }
                      />
                    </label>

                    {row.images && row.images.length > 0 && (
                      <span
                        className="sor-image-name"
                        title={row.images.map((img) => img.name).join(", ")}
                      >
                        {row.images.length} image(s) attached
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="sor-add-row-btn"
            onClick={handleAddRow}
          >
            + Add additional specification row
          </button>
        </section>

        {/* TERMS & CONDITIONS */}
        <section className="sor-section">
          <div className="sor-section-header">Terms and Conditions</div>

          <div className="sor-grid sor-grid-2">
            <div className="sor-field sor-field--full">
              <label>Warranty Conditions</label>
              <textarea
                name="warrantyConditions"
                value={form.warrantyConditions}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Replacement Conditions</label>
              <textarea
                name="replacementConditions"
                value={form.replacementConditions}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Sample Conditions</label>
              <textarea
                name="sampleConditions"
                value={form.sampleConditions}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Return Policy</label>
              <textarea
                name="returnPolicy"
                value={form.returnPolicy}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Negotiation Policy</label>
              <textarea
                name="negotiationPolicy"
                value={form.negotiationPolicy}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <div className="sor-actions">
          <button type="submit" className="sor-save-btn">
            Save Electrical SOR
          </button>
          {savedMessage && (
            <span className="sor-saved-message">{savedMessage}</span>
          )}
        </div>
      </form>

      {/* REVIEW MODAL */}
      {reviewOpen && snapshot && (
        <ReviewModal
          title="Electrical Components – Technical Specification"
          onClose={() => setReviewOpen(false)}
          sorType="electrical"
          data={snapshot}
        >
          <ElectricalReviewView data={snapshot} />
        </ReviewModal>
      )}
    </>
  );
}

/* ---------------- ACCESSORIES SOR FORM ---------------- */

const accessoriesInitialState = {
  companyName: "",
  enquirerName: "",
  contactDetails: "",
  natureOfCompany: "",
  keyAccountManager: "",
  enquiryDate: "",
  sorNo: "",
  documentNo: "",
  revisionStatus: "",

  vehicleType: "",
  technicalMarketingEngineer: "",
  plantLocation: "",

  warrantyConditions: "",
  replacementConditions: "",
  sampleConditions: "",
  returnPolicy: "",
  negotiationPolicy: "",

  modeMaxTorque: "",
  modeMaxSpeed: "",
  modeMaxAcceleration: "",
  modeMaxPower: "",

  commercialWarrantyExpected: "",
  commercialVolumeTargetCost: "",
  commercialGeographicalArea: "",
  additionalNotes: "",
};

function AccessoriesSorForm() {
  const [form, setForm] = useState(accessoriesInitialState);
  const [specRows, setSpecRows] = useState([]);
  const [savedMessage, setSavedMessage] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecRowChange = (id, field, value) => {
    setSpecRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleAddSpecRow = () => {
    setSpecRows((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        specification: "",
        customerReq: "",
        compliance: "",
        remarks: "",
      },
    ]);
  };

  const handleDeleteSpecRow = (id) => {
    setSpecRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...form, specificationRows: specRows };

    try {
      localStorage.setItem("sor-accessories", JSON.stringify(payload));
    } catch (err) {
      console.error("Could not save accessories SOR", err);
    }

    setSnapshot(payload);
    setReviewOpen(true);
    setSavedMessage("Accessories SOR saved in this browser.");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <>
      <form className="sor-form" onSubmit={handleSubmit}>
        <h2 className="sor-title">
          Accessories – Statement of Requirements
        </h2>

        {/* COMPANY DETAILS */}
        <section className="sor-section">
          <div className="sor-section-header">
            Company Details &amp; Business Team
          </div>

          <div className="sor-grid sor-grid-2">
            <div className="sor-field">
              <label>Company Name</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Enquirer Name &amp; Designation</label>
              <input
                name="enquirerName"
                value={form.enquirerName}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Contact No &amp; Email Address</label>
              <input
                name="contactDetails"
                value={form.contactDetails}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Nature of Company</label>
              <input
                name="natureOfCompany"
                value={form.natureOfCompany}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Key Account Manager</label>
              <input
                name="keyAccountManager"
                value={form.keyAccountManager}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Date of Enquiry</label>
              <input
                type="date"
                name="enquiryDate"
                value={form.enquiryDate}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>SOR No.</label>
              <input
                name="sorNo"
                value={form.sorNo}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Revision Status</label>
              <input
                name="revisionStatus"
                value={form.revisionStatus}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* APPLICATION DETAILS + SPEC TABLE */}
        <section className="sor-section">
          <div className="sor-section-header">Application Details</div>

          <div className="sor-grid sor-grid-3">
            <div className="sor-field">
              <label>Vehicle Type / Model</label>
              <input
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Technical Marketing Engineer</label>
              <input
                name="technicalMarketingEngineer"
                value={form.technicalMarketingEngineer}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field">
              <label>Plant Location</label>
              <input
                name="plantLocation"
                value={form.plantLocation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="sor-table-like" style={{ marginTop: 16 }}>
            <div className="sor-table-row sor-table-row--head">
              <div>S.No</div>
              <div>Specifications</div>
              <div>Customer Requirements</div>
              <div>Compliance</div>
              <div>Remarks</div>
            </div>

            {specRows.length === 0 && (
              <div className="sor-empty-row">
                No specification rows yet. Click{" "}
                <strong>“Add additional specification row”</strong> below.
              </div>
            )}

            {specRows.map((row, index) => (
              <div className="sor-table-row" key={row.id}>
                <div>
                  {index + 1}
                  <button
                    type="button"
                    className="sor-row-delete-btn"
                    onClick={() => handleDeleteSpecRow(row.id)}
                  >
                    ×
                  </button>
                </div>
                <div>
                  <textarea
                    placeholder="Specification"
                    value={row.specification}
                    onChange={(e) =>
                      handleSpecRowChange(
                        row.id,
                        "specification",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Customer requirements"
                    value={row.customerReq}
                    onChange={(e) =>
                      handleSpecRowChange(
                        row.id,
                        "customerReq",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Compliance"
                    value={row.compliance}
                    onChange={(e) =>
                      handleSpecRowChange(
                        row.id,
                        "compliance",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Remarks"
                    value={row.remarks}
                    onChange={(e) =>
                      handleSpecRowChange(
                        row.id,
                        "remarks",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="sor-add-row-btn"
            onClick={handleAddSpecRow}
          >
            + Add additional specification row
          </button>
        </section>

        {/* TERMS AND CONDITIONS */}
        <section className="sor-section">
          <div className="sor-section-header">Terms and Conditions</div>

          <div className="sor-grid sor-grid-2">
            <div className="sor-field sor-field--full">
              <label>Warranty Conditions</label>
              <textarea
                name="warrantyConditions"
                value={form.warrantyConditions}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Replacement Conditions</label>
              <textarea
                name="replacementConditions"
                value={form.replacementConditions}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Sample Conditions</label>
              <textarea
                name="sampleConditions"
                value={form.sampleConditions}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Return Policy</label>
              <textarea
                name="returnPolicy"
                value={form.returnPolicy}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Negotiation Policy</label>
              <textarea
                name="negotiationPolicy"
                value={form.negotiationPolicy}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* PERFORMANCE & COMMERCIALS */}
        <section className="sor-section">
          <div className="sor-section-header">Performance &amp; Commercials</div>

          <div className="sor-table-like">
            <div className="sor-table-row sor-table-row--head">
              <div>Mode</div>
              <div>Max Torque (Nm)</div>
              <div>Max Speed (RPM)</div>
              <div>Max Acceleration</div>
              <div>Max Power (W)</div>
            </div>

            <div className="sor-table-row">
              <div>1</div>
              <div>
                <input
                  name="modeMaxTorque"
                  value={form.modeMaxTorque}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="modeMaxSpeed"
                  value={form.modeMaxSpeed}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="modeMaxAcceleration"
                  value={form.modeMaxAcceleration}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="modeMaxPower"
                  value={form.modeMaxPower}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="sor-grid sor-grid-2" style={{ marginTop: 14 }}>
            <div className="sor-field sor-field--full">
              <label>Warranty Expected (yrs &amp; kms)</label>
              <textarea
                name="commercialWarrantyExpected"
                value={form.commercialWarrantyExpected}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Volume and Target Cost</label>
              <textarea
                name="commercialVolumeTargetCost"
                value={form.commercialVolumeTargetCost}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Geographical Area of Sale</label>
              <textarea
                name="commercialGeographicalArea"
                value={form.commercialGeographicalArea}
                onChange={handleChange}
              />
            </div>
            <div className="sor-field sor-field--full">
              <label>Additional Notes</label>
              <textarea
                name="additionalNotes"
                value={form.additionalNotes}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <div className="sor-actions">
          <button type="submit" className="sor-save-btn">
            Save Accessories SOR
          </button>
          {savedMessage && (
            <span className="sor-saved-message">{savedMessage}</span>
          )}
        </div>
      </form>

      {/* REVIEW MODAL */}
      {reviewOpen && snapshot && (
        <ReviewModal
          title="Accessories – Statement of Requirements"
          onClose={() => setReviewOpen(false)}
          sorType="accessories"
          data={snapshot}
        >
          <AccessoriesReviewView data={snapshot} />
        </ReviewModal>
      )}
    </>
  );
}

/* ---------------- REVIEW MODAL + REVIEW VIEWS ---------------- */

function ReviewModal({ title, children, onClose, sorType, data }) {
  const [showFormatForm, setShowFormatForm] = useState(false);

  const handleDownloadClick = () => {
    setShowFormatForm(true);
  };

  const handleCloseFormatForm = () => setShowFormatForm(false);

  const handleDownloadPdf = () => {
    setShowFormatForm(false);
    window.print(); // browser print -> Save as PDF
  };

  const handleDownloadSpreadsheet = () => {
    setShowFormatForm(false);
    downloadSorAsSpreadsheet(sorType, data);
  };

  return (
    <div className="review-backdrop">
      <div className="review-modal">
        <h3 className="review-title">{title}</h3>
        <div className="review-body">{children}</div>
        <div className="review-actions">
          <button
            className="review-download-btn"
            type="button"
            onClick={handleDownloadClick}
          >
            Download
          </button>
          <button
            className="review-edit-btn"
            type="button"
            onClick={onClose}
          >
            Edit Form
          </button>
        </div>

        {showFormatForm && (
          <div className="download-format-modal">
            <p className="download-format-title">Choose download format</p>
            <div className="download-format-actions">
              <button
                type="button"
                className="confirm-btn confirm-btn--secondary"
                onClick={handleDownloadPdf}
              >
                PDF
              </button>
              <button
                type="button"
                className="confirm-btn confirm-btn--primary"
                onClick={handleDownloadSpreadsheet}
              >
                Spreadsheet
              </button>
              <button
                type="button"
                className="download-format-cancel"
                onClick={handleCloseFormatForm}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Review views */

function ElectricalReviewView({ data }) {
  const rows = data.technicalRows || [];
  return (
    <div className="review-section-wrapper">
      <section className="review-section">
        <h4>Company Details &amp; Business Team</h4>
        <div className="review-grid">
          <div>
            <strong>Company Name:</strong> {data.companyName || "-"}
          </div>
          <div>
            <strong>Enquirer:</strong> {data.enquirerName || "-"}
          </div>
          <div>
            <strong>Contact:</strong> {data.contactDetails || "-"}
          </div>
          <div>
            <strong>Nature of Company:</strong> {data.natureOfCompany || "-"}
          </div>
          <div>
            <strong>Key Account Manager:</strong>{" "}
            {data.keyAccountManager || "-"}
          </div>
          <div>
            <strong>Date of Enquiry:</strong> {data.enquiryDate || "-"}
          </div>
          <div>
            <strong>Document No.:</strong> {data.docNo || "-"}
          </div>
          <div>
            <strong>Revision Status:</strong> {data.revisionStatus || "-"}
          </div>
        </div>
      </section>

      <section className="review-section">
        <h4>Technical Specification</h4>
        <table className="review-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Key parameters</th>
              <th>SMG Standard</th>
              <th>Supplier</th>
              <th>Remarks / Image</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>No specification rows added.</td>
              </tr>
            ) : (
              rows.map((row, i) => {
                const images = row.images || [];
                return (
                  <tr key={row.id || i}>
                    <td>{i + 1}</td>
                    <td>{row.keyParameter || "-"}</td>
                    <td>{row.standard || "-"}</td>
                    <td>{row.supplier || "-"}</td>
                    <td>
                      <div>{row.remarks || "-"}</div>

                      {images.length > 0 && (
                        <div className="review-image-wrapper">
                          {images.map((img) => (
                            <div key={img.id} className="review-image-item">
                              <img
                                src={img.dataUrl}
                                alt={img.name || "Image"}
                                className="review-image"
                              />
                              {img.name && (
                                <div className="review-image-name">
                                  {img.name}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <section className="review-section">
        <h4>Terms and Conditions</h4>
        <div className="review-grid">
          <div>
            <strong>Warranty Conditions:</strong>{" "}
            {data.warrantyConditions || "-"}
          </div>
          <div>
            <strong>Replacement Conditions:</strong>{" "}
            {data.replacementConditions || "-"}
          </div>
          <div>
            <strong>Sample Conditions:</strong>{" "}
            {data.sampleConditions || "-"}
          </div>
          <div>
            <strong>Return Policy:</strong> {data.returnPolicy || "-"}
          </div>
          <div>
            <strong>Negotiation Policy:</strong>{" "}
            {data.negotiationPolicy || "-"}
          </div>
        </div>
      </section>
    </div>
  );
}

function AccessoriesReviewView({ data }) {
  const rows = data.specificationRows || [];
  return (
    <div className="review-section-wrapper">
      <section className="review-section">
        <h4>Company Details &amp; Business Team</h4>
        <div className="review-grid">
          <div>
            <strong>Company Name:</strong> {data.companyName || "-"}
          </div>
          <div>
            <strong>Enquirer:</strong> {data.enquirerName || "-"}
          </div>
          <div>
            <strong>Contact:</strong> {data.contactDetails || "-"}
          </div>
          <div>
            <strong>Nature of Company:</strong> {data.natureOfCompany || "-"}
          </div>
          <div>
            <strong>Key Account Manager:</strong>{" "}
            {data.keyAccountManager || "-"}
          </div>
          <div>
            <strong>Date of Enquiry:</strong> {data.enquiryDate || "-"}
          </div>
          <div>
            <strong>SOR No.:</strong> {data.sorNo || "-"}
          </div>
          <div>
            <strong>Revision Status:</strong> {data.revisionStatus || "-"}
          </div>
        </div>
      </section>

      <section className="review-section">
        <h4>Application Details</h4>
        <div className="review-grid">
          <div>
            <strong>Vehicle Type / Model:</strong> {data.vehicleType || "-"}
          </div>
          <div>
            <strong>Technical Marketing Engineer:</strong>{" "}
            {data.technicalMarketingEngineer || "-"}
          </div>
          <div>
            <strong>Plant Location:</strong> {data.plantLocation || "-"}
          </div>
        </div>
      </section>

      <section className="review-section">
        <h4>Specifications</h4>
        <table className="review-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Specification</th>
              <th>Customer Requirements</th>
              <th>Compliance</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>No specification rows added.</td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={row.id || i}>
                  <td>{i + 1}</td>
                  <td>{row.specification || "-"} </td>
                  <td>{row.customerReq || "-"}</td>
                  <td>{row.compliance || "-"}</td>
                  <td>{row.remarks || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="review-section">
        <h4>Performance &amp; Commercials</h4>
        <div className="review-grid">
          <div>
            <strong>Mode 1 – Max Torque:</strong>{" "}
            {data.modeMaxTorque || "-"}
          </div>
          <div>
            <strong>Mode 1 – Max Speed:</strong> {data.modeMaxSpeed || "-"}
          </div>
          <div>
            <strong>Mode 1 – Max Acceleration:</strong>{" "}
            {data.modeMaxAcceleration || "-"}
          </div>
          <div>
            <strong>Mode 1 – Max Power:</strong> {data.modeMaxPower || "-"}
          </div>
          <div>
            <strong>Warranty Expected:</strong>{" "}
            {data.commercialWarrantyExpected || "-"}
          </div>
          <div>
            <strong>Volume &amp; Target Cost:</strong>{" "}
            {data.commercialVolumeTargetCost || "-"}
          </div>
          <div>
            <strong>Geographical Area of Sale:</strong>{" "}
            {data.commercialGeographicalArea || "-"}
          </div>
          <div>
            <strong>Additional Notes:</strong> {data.additionalNotes || "-"}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Generate spreadsheet from SOR data ---------- */

function downloadSorAsSpreadsheet(type, data) {
  const wb = XLSX.utils.book_new();

  if (type === "electrical") {
    const wsData = [];

    wsData.push(["SMG", "", "", "", ""]);
    wsData.push(["TECHNICAL SPECIFICATION", "", "", "", ""]);
    wsData.push([]);
    wsData.push([
      "Sl.No",
      "Key parameters",
      "SMG ELECTRIC SCOOTERS Standard",
      "SUPPLIER",
      "Remarks",
    ]);

    (data.technicalRows || []).forEach((row, index) => {
      const remarks =
        row.remarks || (row.images || []).map((img) => img.name).join(", ");
      wsData.push([
        index + 1,
        row.keyParameter || "",
        row.standard || "",
        row.supplier || "",
        remarks || "",
      ]);
    });

    wsData.push([]);
    wsData.push(["Warranty Conditions", data.warrantyConditions || ""]);
    wsData.push([
      "Replacement Conditions",
      data.replacementConditions || "",
    ]);
    wsData.push(["Sample Conditions", data.sampleConditions || ""]);
    wsData.push(["Return Policy", data.returnPolicy || ""]);
    wsData.push(["Negotiation Policy", data.negotiationPolicy || ""]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!merges"] = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    ];

    ws["!cols"] = [
      { wch: 8 },
      { wch: 35 },
      { wch: 30 },
      { wch: 20 },
      { wch: 25 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Technical Spec");
    XLSX.writeFile(wb, "Electrical_Technical_Spec.xlsx");
  } else if (type === "accessories") {
    const wsData = [];

    wsData.push(["SMG", "", "", "", "", ""]);
    wsData.push(["STATEMENT OF REQUIREMENTS", "", "", "", "", ""]);
    wsData.push([]);
    wsData.push(["COMPANY DETAILS & BUSINESS TEAM"]);
    wsData.push([
      "Company Name",
      data.companyName || "",
      "Enquirer Name & Designation",
      data.enquirerName || "",
    ]);
    wsData.push([
      "Contact No & Email Address",
      data.contactDetails || "",
      "Nature of Company",
      data.natureOfCompany || "",
    ]);
    wsData.push([
      "Key Account Manager",
      data.keyAccountManager || "",
      "Date of Enquiry",
      data.enquiryDate || "",
    ]);
    wsData.push([
      "SOR No.",
      data.sorNo || "",
      "Revision Status",
      data.revisionStatus || "",
    ]);

    wsData.push([]);
    wsData.push(["APPLICATION DETAILS"]);
    wsData.push([
      "S No",
      "SPECIFICATIONS",
      "CUSTOMER REQUIREMENTS",
      "COMPLIANCE",
      "REMARKS",
    ]);

    (data.specificationRows || []).forEach((row, index) => {
      wsData.push([
        index + 1,
        row.specification || "",
        row.customerReq || "",
        row.compliance || "",
        row.remarks || "",
      ]);
    });

    wsData.push([]);
    wsData.push(["Warranty Conditions", data.warrantyConditions || ""]);
    wsData.push([
      "Replacement Conditions",
      data.replacementConditions || "",
    ]);
    wsData.push(["Sample Conditions", data.sampleConditions || ""]);
    wsData.push(["Return Policy", data.returnPolicy || ""]);
    wsData.push(["Negotiation Policy", data.negotiationPolicy || ""]);

    wsData.push([]);
    wsData.push(["Commercials"]);
    wsData.push([
      "Warranty Expected",
      data.commercialWarrantyExpected || "",
    ]);
    wsData.push([
      "Volume and Target Cost",
      data.commercialVolumeTargetCost || "",
    ]);
    wsData.push([
      "Geographical Area of Sale",
      data.commercialGeographicalArea || "",
    ]);
    wsData.push(["Additional Notes", data.additionalNotes || ""]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!merges"] = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } },
      { s: { r: 9, c: 0 }, e: { r: 9, c: 4 } },
    ];

    ws["!cols"] = [
      { wch: 12 },
      { wch: 35 },
      { wch: 30 },
      { wch: 18 },
      { wch: 25 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "SOR");
    XLSX.writeFile(wb, "Accessories_SOR.xlsx");
  }
}

export default function SOR() {
  const [activeSor, setActiveSor] = useState("electrical");

  return (
    <div className="sor-page p-6">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1B365D]">Statement of Requirements</h1>
          <p className="text-gray-500">Manage technical specifications and requirements</p>
      </div>

      <div className="sor-tabs flex gap-4 border-b border-gray-200 mb-6">
        <button
          className={`pb-2 px-4 font-medium transition-colors relative ${
            activeSor === "electrical"
              ? "text-[#1B365D] border-b-2 border-[#1B365D]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveSor("electrical")}
        >
          Electrical Components
        </button>
        <button
          className={`pb-2 px-4 font-medium transition-colors relative ${
            activeSor === "accessories"
              ? "text-[#1B365D] border-b-2 border-[#1B365D]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveSor("accessories")}
        >
          Accessories
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {activeSor === "electrical" ? <ElectricalSorForm /> : <AccessoriesSorForm />}
      </div>
    </div>
  );
}
