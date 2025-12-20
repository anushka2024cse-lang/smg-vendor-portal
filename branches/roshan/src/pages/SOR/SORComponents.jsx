import React, { useState } from 'react';
import * as XLSX from "xlsx";
import './SOR.css';

/* ---------------- REVIEW MODAL + REVIEW VIEWS ---------------- */

export function ReviewModal({ title, children, onClose, sorType, data }) {
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

export function ElectricalReviewView({ data }) {
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

export function AccessoriesReviewView({ data }) {
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
