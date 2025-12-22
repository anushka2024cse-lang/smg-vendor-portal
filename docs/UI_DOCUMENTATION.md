# SMG Vendor Portal - Complete UI Documentation with URLs

## Quick Navigation
- [Dashboard](#dashboard) - `http://localhost:5174/dashboard`
- [Vendors](#vendors-module) - `http://localhost:5174/vendor/*`
- [Purchase Orders](#purchase-orders-module) - `http://localhost:5174/purchase-orders/*`
- [Payments](#payments-module) - `http://localhost:5174/payments`
- [Orders](#orders-module) - `http://localhost:5174/orders`
- [SOR](#sor-module) - `http://localhost:5174/sor/*`
- [Settings](#settings) - `http://localhost:5174/settings`

---

# Dashboard

## Page: Dashboard Home
**URL**: `http://localhost:5174/dashboard`  
**Route**: `/dashboard`

### Purpose
Main landing page showing key metrics, recent activity, and quick actions.

### Components Breakdown

#### Stats Cards (4 cards)
1. **Total Vendors**
   - Shows: Count of all vendors
   - Clickable: Yes → `/vendor/list`

2. **Active Orders**  
   - Shows: Count of pending orders
   - Clickable: Yes → `/orders`

3. **Pending Payments**
   - Shows: Count of payments awaiting approval
   - Clickable: Yes → `/payments`

4. **Total Components**
   - Shows: Component inventory count
   - Clickable: Yes → `/inventory`

#### Quick Actions Panel
- **Create Purchase Order** → `http://localhost:5174/purchase-orders/create`
- **Add Vendor** → `http://localhost:5174/vendor/onboarding`
- **View Reports** → `http://localhost:5174/reports`

---

# Vendors Module

## Page: Vendor List
**URL**: `http://localhost:5174/vendor/list`  
**Route**: `/vendor/list`

### Top Action Buttons

#### 1. Export CSV Button
- **Location**: Top right
- **Icon**: 📄 FileText (lucide-react)
- **Label**: "Export CSV"
- **Style**: `bg-white border border-slate-200 text-slate-700 rounded-lg`
- **Action**: Downloads CSV file
- **API Call**: `GET /api/v1/vendors/export`
- **File**: `vendors-export-{date}.csv`

#### 2. Add New Vendor Button
- **Location**: Top right (next to Export)
- **Icon**: ➕ Plus
- **Label**: "Add New Vendor"
- **Style**: `bg-blue-900 text-white rounded-lg shadow-md`
- **Hover**: `bg-blue-800 shadow-lg`
- **Action**: Navigate to vendor onboarding
- **Destination**: `http://localhost:5174/vendor/onboarding`

### Stats Cards Row
All cards display live counts from backend.

1. **Total Vendors**
   - **Color**: Blue theme
   - **Icon**: MoreVertical
   - **Data Source**: `vendors.length`

2. **Active**
   - **Color**: Green (emerald-700)
   - **Icon**: CheckCircle
   - **Data Source**: `vendors.filter(v => v.status === 'Active').length`

3. **Pending**
   - **Color**: Amber (amber-600)
   - **Icon**: Clock
   - **Data Source**: `vendors.filter(v => v.status === 'Pending').length`

4. **Blocked**
   - **Color**: Red (red-600)
   - **Icon**: Ban
   - **Data Source**: `vendors.filter(v => v.status === 'Blocked').length`

### Filter Bar

#### Search Input
- **Placeholder**: "Search by vendor name or ID..."
- **Icon**: 🔍 Search (left side)
- **Width**: `w-full md:w-96`
- **Searches**: 
  - Vendor name (case-insensitive)
  - Vendor ID (_id or vendorId)
- **Real-time**: Yes
- **Debounced**: No (instant filter)

#### Status Filter Dropdown
- **Label**: "Filter Status:"
- **Icon**: 🎛️ Filter
- **Default**: "All Statuses"
- **Options**:
  - All Statuses
  - Active
  - Pending
  - Blocked

### Vendor Table

#### Columns
| Column | Field | Width | Sortable | Format |
|--------|-------|-------|----------|--------|
| Vendor Code | `vendorId` or `_id` | 120px | No | `V-XXXX` in gray badge |
| Company Name | `name` | Auto | No | Bold text |
| Business Type | `type` | 150px | No | Plain text |
| Primary Contact | `contact` | 200px | No | Avatar + name |
| City | `city` | 120px | No | Plain text or 'N/A' |
| Status | `status` | 120px | No | Colored badge |
| Actions | - | 120px | No | Hover menu |

#### Row Hover Actions
Actions appear when hovering over a row (opacity-0 to opacity-100 transition).

##### 1. View Details Button
- **Icon**: 👁️ Eye
- **Size**: 18px
- **Color**: Slate-400 → Blue-600 on hover
- **Background**: Transparent → Blue-50 on hover
- **Tooltip**: "View Details"
- **Action**: Navigate to vendor details
- **URL**: `http://localhost:5174/vendor/details/${vendorId}`

##### 2. Edit Vendor Button
- **Icon**: ✏️ Edit
- **Size**: 18px
- **Color**: Slate-400 → Amber-600 on hover
- **Background**: Transparent → Amber-50 on hover
- **Tooltip**: "Edit Vendor"
- **Action**: Open Edit Modal
- **Prevents**: Row click (e.stopPropagation())

##### 3. Block/Unblock Button
- **Icon**: 🚫 Ban
- **Size**: 18px
- **Color**: 
  - If Blocked: Red-600 on Red-50 background
  - If Active: Slate-400 → Red-600 on hover
- **Tooltip**: "Block Vendor" or "Unblock Vendor"
- **Action**: Toggle vendor status
- **API**: `PUT /api/v1/vendors/${vendorId}`
- **Body**: `{ status: newStatus }`
- **Refresh**: Auto-refresh list after success

### Edit Vendor Modal

**Trigger**: Click ✏️ Edit button  
**Component**: Inline modal (not separate route)

#### Modal Structure
```
┌────────────────────────────────────┐
│ Edit Vendor Details          [X]   │ ← Header
├────────────────────────────────────┤
│                                    │
│ Form Fields (6 fields)             │ ← Body
│                                    │
├────────────────────────────────────┤
│         [Cancel] [💾 Save Changes] │ ← Footer
└────────────────────────────────────┘
```

#### Header
- **Title**: "Edit Vendor Details"
- **Close Button**: X icon (size 24)
  - Action: Close modal without saving
  - Sets: `setIsEditModalOpen(false)`

#### Form Fields

1. **Company Name**
   - Type: Text input
   - Value: `editingVendor.name`
   - Required: Yes
   - Style: `bg-slate-50 border border-slate-200 rounded-lg`

2. **Business Type**
   - Type: Dropdown select
   - Value: `editingVendor.type`
   - Options: Pvt Ltd, Ltd, Proprietorship
   - Required: Yes

3. **City**
   - Type: Text input
   - Value: `editingVendor.city`

4. **Primary Contact**
   - Type: Text input
   - Value: `editingVendor.contact`

5. **Status**
   - Type: Dropdown select
   - Value: `editingVendor.status`
   - Options: Active, Blocked, Pending

#### Footer Buttons

**Cancel Button**:
- **Label**: "Cancel"
- **Style**: `bg-transparent text-slate-600 hover:bg-slate-200`
- **Action**: Close modal
- **Function**: `setIsEditModalOpen(false)`

**Save Changes Button**:
- **Label**: "Save Changes"
- **Icon**: 💾 Save (left side)
- **Style**: `bg-blue-900 text-white hover:bg-blue-800`
- **Action**: Submit changes
- **API**: `PUT /api/v1/vendors/${editingVendor._id}`
- **Body**: Updated editingVendor object
- **Success**: 
  - Close modal
  - Refresh vendor list
  - Show success notification

---

## Page: Vendor Onboarding
**URL**: `http://localhost:5174/vendor/onboarding`  
**Route**: `/vendor/onboarding`

### Purpose
Multi-step wizard (4 steps) for registering new vendors.

### Progress Indicator

#### Step Display
```
① Identity Details → ② Address & Contact → ③ Finance & Bank → ④ Compliance (Tax)
```

Each step shows:
- **Completed**: ✓ Green checkmark, filled circle
- **Current**: Blue filled circle, no checkmark
- **Future**: Gray unfilled circle

#### Progress Bar
- **Width**: Full width of form
- **Color**: Blue-900
- **Formula**: `((currentStep - 1) / 3) * 100%`
- **Animation**: Smooth transition

### Step 1: Identity Details
**URL**: Same (`/vendor/onboarding?step=1`)

#### Fields (6 total)

1. **Company Name***
   - Type: Text
   - Placeholder: "e.g., Menasski Polymer Industries"
   - State: `formData.name`
   - Handler: `onChange={(e) => handleInputChange('name', e.target.value)}`
   - Required: ✅
   - Validation: Non-empty

2. **Business Type***
   - Type: Dropdown
   - Options:
     - Proprietorship
     - Partnership
     - Pvt Ltd
     - Ltd
     - LLP
   - State: `formData.businessType`
   - Required: ✅

3. **Proprietor/Owner Name***
   - Type: Text
   - Placeholder: "Full Name"
   - State: `formData.proprietorName`
   - Required: ✅

4. **Email***
   - Type: Email
   - Placeholder: "contact@company.com"
   - State: `formData.email`
   - Required: ✅
   - Validation: Email format (HTML5)

5. **Phone Number***
   - Type: Tel
   - Placeholder: "9876543210"
   - State: `formData.phone`
   - Required: ✅
   - Validation: 10 digits recommended

6. **Staff Strength**
   - Type: Number
   - Placeholder: "e.g. 50"
   - State: `formData.staffStrength`
   - Required: ❌

#### Navigation Button

**Next Step Button**:
- **Label**: "Next Step →"
- **Icon**: ChevronRight (right side)
- **Style**: `bg-blue-900 text-white rounded-lg`
- **Action**: `handleNext()` → increments currentStep
- **Validation**: None (data persists even if empty)

### Step 2: Address & Contact
**URL**: Same (`/vendor/onboarding?step=2`)

#### Fields (4 total)

1. **Complete Address***
   - Type: Text
   - Placeholder: "Street, Area, Landmark"
   - State: `formData.address`
   - Required: ✅

2. **City***
   - Type: Text
   - State: `formData.city`
   - Required: ✅

3. **State***
   - Type: Text
   - State: `formData.state`
   - Required: ✅

4. **PIN Code***
   - Type: Text
   - Placeholder: "6 digits"
   - State: `formData.pincode`
   - Required: ✅
   - Pattern: `\d{6}`

#### Navigation Buttons

**Previous Step Button**:
- **Label**: "← Previous"
- **Icon**: ChevronLeft (left side)
- **Style**: `bg-white text-slate-600 border border-slate-200`
- **Action**: `handlePrev()` → decrements currentStep
- **Note**: Data persists when going back

**Next Step Button**:
- Same as Step 1
- Goes to Step 3

### Step 3: Finance & Bank Details
**URL**: Same (`/vendor/onboarding?step=3`)

#### Fields (4 total)

1. **Bank Name**
   - Type: Text
   - Placeholder: "e.g., HDFC Bank"
   - State: `formData.bankName`
   - Required: ❌

2. **Account Number**
   - Type: Text
   - Placeholder: "XXXXXXXXXX"
   - State: `formData.accountNumber`
   - Required: ❌

3. **IFSC Code**
   - Type: Text
   - Placeholder: "e.g., HDFC0001234"
   - State: `formData.ifscCode`
   - Pattern: `[A-Z]{4}0[A-Z0-9]{6}`
   - Required: ❌

4. **Upload Cancelled Cheque**
   - Type: File upload
   - Accept: `.jpg, .png, .pdf`
   - Max Size: 5MB
   - Status: TODO - Not implemented yet
   - Required: ❌

#### Navigation
- **Previous** → Step 2
- **Next** → Step 4

### Step 4: Compliance (Tax)
**URL**: Same (`/vendor/onboarding?step=4`)

#### Fields (5 total)

1. **PAN Number***
   - Type: Text
   - Placeholder: "ABCDE1234F"
   - State: `formData.pan`
   - Pattern: `[A-Z]{5}[0-9]{4}[A-Z]{1}`
   - Required: ✅

2. **TAN Number**
   - Type: Text
   - Placeholder: "ABCD12345E"
   - State: `formData.tanNumber`
   - Required: ❌

3. **GST Registration Status**
   - Type: Dropdown
   - Options: Registered, Unregistered, Composition Scheme
   - State: `formData.gstStatus`
   - Required: ❌

4. **GST Number**
   - Type: Text
   - Placeholder: "22AAAAA0000A1Z5"
   - State: `formData.gstNumber`
   - Conditional: Show if GST Status = Registered
   - Required: Conditional

5. **Payment Terms**
   - Type: Dropdown
   - Options:
     - Immediate
     - Net 7 Days
     - Net 15 Days
     - Net 30 Days (default)
     - Net 60 Days
     - Net 90 Days
   - State: `formData.paymentTerms`

#### Final Submit Button

**Submit Application Button**:
- **Label**: "✓ Submit Application"
- **Icon**: Send (Truck icon)
- **Style**: `bg-blue-900 text-white rounded-lg font-semibold`
- **Action**: `handleSubmit()`
- **Validation**: Checks name, businessType, email, phone
- **API**: `POST http://localhost:5000/api/v1/vendors`
- **Payload**:
```json
{
  "name": "Company Name",
  "type": "Pvt Ltd",
  "contact": "John Doe",
  "email": "john@company.com",
  "phone": "9876543210",
  "city": "Mumbai",
  "address": {
    "street": "123 Main St",
    "state": "Maharashtra",
    "zip": "400001",
    "country": "India"
  },
  "bank": {
    "name": "HDFC Bank",
    "account": "1234567890",
    "ifsc": "HDFC0001234"
  },
  "tax": {
    "pan": "ABCDE1234F",
    "gst": "22AAAAA0000A1Z5"
  }
}
```
- **Success**: 
  - Alert: "Vendor registered successfully!"
  - Navigate: `http://localhost:5174/vendor/list`
- **Error**: 
  - Alert: "Failed to register vendor: {error message}"

---

## Page: Vendor Details
**URL**: `http://localhost:5174/vendor/details/:id`  
**Route**: `/vendor/details/:id`  
**Example**: `http://localhost:5174/vendor/details/507f1f77bcf86cd799439011`

### Top Navigation

**Back Button**:
- **Icon**: ← ChevronLeft
- **Label**: "Back to Vendors"
- **Style**: Text button with icon
- **Action**: Navigate to `/vendor/list`

### Vendor Header Card
- **Vendor Name**: Large heading
- **Vendor ID**: Badge format (V-XXXX)
- **Business Type**: Secondary text
- **Status Badge**: Active/Pending/Blocked

### Stats Row
Three metric cards:
1. **Total Revenue** (if available)
2. **Total Orders**
3. **Payments Made**

### Tab Navigation

#### Tabs
1. **Overview** (default)
2. **Orders** (`/vendor/details/:id?tab=orders`)
3. **Payments** (`/vendor/details/:id?tab=payments`)
4. **Documents** (`/vendor/details/:id?tab=documents`)

#### Overview Tab Content
- Contact Information section
- Address Details
- Bank Details
- Tax Information
- Created Date

#### Orders Tab Content
- List of purchase orders involving this vendor
- Filter by order status
- Table similar to main orders page

#### Payments Tab Content
- Payment history for this vendor
- Status breakdown
- Payment timeline

#### Documents Tab Content
- List of uploaded documents
- Upload new document button
- Download/view document actions

---

# Payments Module

## Page: Payment List
**URL**: `http://localhost:5174/payments`  
**Route**: `/payments`

### Top Action Bar

#### 1. Export CSV Button
- **Icon**: 📄 FileText
- **Label**: "Export CSV"
- **Style**: White background, slate border
- **API**: `GET /api/v1/payments/export`
- **Downloads**: `payments-{date}.csv`

#### 2. Create Payment Button
- **Icon**: ➕ Plus
- **Label**: "Create Payment"
- **Style**: `bg-blue-900 text-white shadow-md hover:shadow-lg`
- **Action**: Opens Create Payment Modal
- **Function**: `setIsCreateModalOpen(true)`

### Stats Cards (5 cards)

1. **Total Payments**
   - Shows: Sum of all payment amounts
   - Format: `₹5.2L` (lakhs notation)
   - Icon: Custom

2. **Pending**
   - Shows: Sum of pending payments
   - Format: `₹2.1L`
   - Color: Amber

3. **Approved**
   - Shows: Sum of approved payments
   - Format: `₹1.8L`
   - Color: Blue

4. **Paid**
   - Shows: Sum of completed payments
   - Format: `₹1.2L`
   - Color: Green

5. **Rejected**
   - Shows: Sum of rejected payments
   - Format: `₹0`
   - Color: Red

### Filter Controls

#### Search Bar
- **Placeholder**: "Search payments..."
- **Icon**: 🔍 Search
- **Searches**: Payment number, vendor name, invoice number
- **Width**: Full on mobile, 400px on desktop

#### Status Filter
- **Label**: "Filter:"
- **Default**: "All"
- **Options**: All, Pending, Processing, Approved, Paid, Rejected, On Hold, Cancelled

#### Payment Mode Filter
- **Label**: "Mode:"
- **Default**: "All"
- **Options**: All, RTGS, NEFT, UPI, Cheque, Cash, Other

### Payment Table

#### Columns
| Column | Field | Width | Format |
|--------|-------|-------|--------|
| Payment # | `paymentNumber` | 140px | PAY-2025-XXX |
| Vendor | `vendor.name` | Auto | Vendor name |
| Invoice # | `invoiceNumber` | 140px | INV-XXX |
| Amount | `paymentAmount` | 120px | ₹XX,XXX |
| Due Date | `dueDate` | 120px | DD-MM-YYYY |
| Status | `status` | 120px | Badge |
| Actions | - | 160px | Buttons |

#### Row Action Buttons (4 buttons)

##### 1. View Details
- **Icon**: 👁️ Eye
- **Color**: Blue-600
- **Tooltip**: "View Details"
- **Action**: Opens Payment Details Modal

##### 2. Edit Status
- **Icon**: ✏️ Edit
- **Color**: Amber-600
- **Tooltip**: "Update Status"
- **Action**: Opens Status Update Modal

##### 3. Send Request
- **Icon**: 📨 Send
- **Color**: Purple-600
- **Tooltip**: "Send Payment Request"
- **Condition**: Only show if status !== 'Paid'
- **API**: `POST /api/v1/payments/:id/send-request`
- **Confirmation**: "Send payment request to vendor?"
- **Success**: "Payment request sent successfully!"

##### 4. Download Receipt
- **Icon**: ⬇️ Download
- **Color**: Green-600
- **Tooltip**: "Download Receipt"
- **Condition**: Only show if status === 'Paid'
- **Action**: Generate PDF receipt
- **Function**: Calls paymentService.downloadReceipt()

---

### Modal: Create New Payment
**URL**: Same page (modal overlay)  
**Trigger**: Click "Create Payment" button  
**Size**: 800px wide, auto height

#### Header
- **Title**: "Create New Payment"
- **Background**: Blue-900 gradient
- **Text Color**: White
- **Close Button**: X icon (white, size 24)

#### Form Layout (Scrollable Body)

**Section 1: Basic Information**

1. **Vendor*** (Dropdown)
   - **Fetches from**: `GET /api/v1/vendors`
   - **Display**: Vendor name
   - **Value**: Vendor ObjectId
   - **Placeholder**: "Select Vendor"
   - **Style**: Full width
   - **Required**: Yes

2. **Invoice Number*** (Text)
   - **Placeholder**: "INV-2025-001"
   - **Pattern**: Any
   - **Required**: Yes

3. **Invoice Date*** (Date Picker)
   - **Input**: HTML5 date
   - **Format**: YYYY-MM-DD (stored), DD-MM-YYYY (displayed)
   - **Required**: Yes

**Section 2: Amounts** (Grid 2 columns)

4. **Invoice Amount*** (Number)
   - **Placeholder**: "0.00"
   - **Min**: 0
   - **Step**: 0.01
   - **Required**: Yes

5. **Payment Amount*** (Number)
   - **Placeholder**: "0.00"
   - **Min**: 0
   - **Step**: 0.01
   - **Required**: Yes
   - **Effect**: Triggers TDS calculation

6. **TDS Amount (2%)** (Number - Disabled)
   - **Value**: Auto-calculated (Payment Amount × 0.02)
   - **Disabled**: True
   - **Style**: Gray background
   - **Formula**: `useEffect` watches `formData.paymentAmount`

7. **Other Deductions** (Number)
   - **Placeholder**: "0.00"
   - **Default**: 0
   - **Min**: 0
   - **Step**: 0.01

**Section 3: Net Payable** (Highlighted Box)

8. **Net Payable Amount** (Display Only)
   - **Container Style**: Blue-900 background, white text, rounded, padded
   - **Label**: "NET PAYABLE AMOUNT" (uppercase, small)
   - **Value Font**: 36px, bold
   - **Format**: `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
   - **Calculation**: `paymentAmount - tdsAmount - otherDeductions`
   - **Function**: `calculateNetPayable()`

**Section 4: Payment Details** (Grid 2 columns)

9. **Payment Type*** (Dropdown)
   - **Options**:
     - Advance
     - Against Invoice (default)
     - Partial
     - Final Settlement
   - **Required**: Yes

10. **Due Date*** (Date Picker)
    - **Min**: Today
    - **Required**: Yes

11. **Payment Mode** (Dropdown)
    - **Options**: RTGS (default), NEFT, UPI, Cheque, Cash, Other
    - **Not Required**

**Section 5: Bank Details (Optional)**
- **Divider**: "Bank Details (Optional)"
- **Grid**: 2 columns

12. **Account Number** (Text)
13. **IFSC Code** (Text)
14. **Bank Name** (Text)
15. **Branch** (Text)

**Section 6: Additional**

16. **Remarks** (Textarea)
    - **Rows**: 3
    - **Placeholder**: "Add any additional notes..."

17. **Send Request Checkbox**
    - **Label**: "📧 Send payment request notification to vendor after creation"
    - **Default**: Unchecked
    - **Value**: `formData.sendRequest`

#### Footer Buttons

**Cancel Button**:
- **Label**: "Cancel"
- **Style**: Gray background
- **Action**: Close modal, reset form
- **Function**: `onClose()`

**Create Payment Button**:
- **Label**: "Creating..." (when loading) or "Create Payment"
- **Style**: Blue-900 background
- **Disabled**: When loading or missing required fields
- **Action**: 
  1. Calculate netPayableAmount
  2. `POST /api/v1/payments` with complete payload
  3. If `sendRequest` checked: `POST /api/v1/payments/:id/send-request`
  4. Close modal
  5. Refresh payment list
  6. Show success notification

**API Payload**:
```json
{
  "vendor": "ObjectId",
  "invoiceNumber": "INV-2025-001",
  "invoiceDate": "2025-12-23",
  "invoiceAmount": 100000,
  "paymentAmount": 100000,
  "tdsAmount": 2000,
  "otherDeductions": 0,
  "netPayableAmount": 98000,
  "paymentType": "against-invoice",
  "dueDate": "2025-12-28",
  "paymentMode": "RTGS",
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "bankName": "State Bank",
    "branch": "Main Branch"
  },
  "remarks": "Payment for materials"
}
```


## Table of Contents - Remaining Modules
- [Orders Module](#orders-module)
- [Purchase Orders Module](#purchase-orders-module)
- [SOR Module](#sor-module)
- [Inventory Module](#inventory-module)
- [Production Module](#production-module)
- [Settings](#settings)

---

# Orders Module

## Page: Order History
**URL**: `http://localhost:5174/orders`  
**Route**: `/orders`

### Purpose
Track and manage all purchase orders with filtering and status updates.

### Top Action Buttons

#### Export CSV
- **Icon**: 📄 FileText
- **Label**: "Export CSV"
- **API**: `GET /api/v1/orders/export`

#### Create Order
- **Icon**: ➕ Plus
- **Label**: "Create Order"
- **Destination**: `http://localhost:5174/purchase-orders/create`

### Stats Cards (5 cards)

1. **Total Orders** - Count of all orders
2. **Pending** - Orders awaiting approval
3. **In Progress** - Active orders
4. **Completed** - Finished orders
5. **Cancelled** - Cancelled orders

### Filter Controls
- **Search**: Order number, vendor name
- **Status Filter**: All, Pending, In Progress, Completed, Cancelled
- **Date Range**: From/To date pickers

### Table Columns
| Column | Field | Format |
|--------|-------|--------|
| Order # | `orderNumber` | ORD-XXXXXX |
| Vendor | `vendor.name` | Text |
| Order Date | `orderDate` | DD-MM-YYYY |
| Items | `items.length` | Number |
| Total Amount | `totalAmount` | ₹XX,XXX |
| Status | `status` | Badge |
| Actions | - | Buttons |

### Row Actions

#### View Details
- **Icon**: 👁️ Eye
- **Action**: Opens Order Details Modal
- **Shows**: Complete order information

#### Update Status
- **Icon**: ✏️ Edit
- **Action**: Opens Status Update Modal
- **Workflow**: Pending → Processing → Shipped → Delivered

#### Download Order
- **Icon**: ⬇️ Download
- **Action**: Download order as PDF

---

# Purchase Orders Module

## Page: Purchase Order List
**URL**: `http://localhost:5174/purchase-orders`  
**Route**: `/purchase-orders`

### Purpose
Digital twin of physical purchase order management.

### Top Buttons

#### Filter Drafts
- **Label**: "View Drafts"
- **Style**: White background
- **Action**: Shows only draft orders (not sent to vendor)

#### Create PO
- **Icon**: ➕ Plus
- **Label**: "Create Purchase Order"
- **Style**: Blue-900 background
- **Destination**: `http://localhost:5174/purchase-orders/create`

### PO Table
Shows all purchase orders with vendor info, items, amounts, and status.

---

## Page: Create Purchase Order
**URL**: `http://localhost:5174/purchase-orders/create`  
**Route**: `/purchase-orders/create`

### Layout
```
┌──────────────────────────────────────────┐
│  Create Purchase Order                   │
│  [← Back to List]                        │
├──────────────────────────────────────────┤
│  PO Number: [Auto-generated]             │
│  Vendor: [Select Vendor ▼]               │
│  PO Date: [23-12-2025]                   │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Item Details                       │ │
│  │ [+ Add Item]                       │ │
│  │                                    │ │
│  │ 1. [Item Name] [Qty] [Rate] [Amt] │ │
│  │ 2. [Item Name] [Qty] [Rate] [Amt] │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Subtotal: ₹XX,XXX                      │
│  ☑ Apply Discount                       │
│  Discount: [10%]                        │
│  Tax (GST): [18%]                       │
│  ─────────────────                      │
│  Total: ₹XX,XXX                         │
│                                          │
│  Terms & Conditions: [...]              │
│                                          │
│         [Save Draft] [Send to Vendor]   │
└──────────────────────────────────────────┘
```

### Header Section

#### PO Number (Read-only)
- **Display**: Auto-generated (PO-XXXXXX)
- **Generated**: On first save

#### Vendor Dropdown
- **API**: `GET /api/v1/vendors`
- **Required**: Yes
- **Shows**: Active vendors only

#### PO Date
- **Type**: Date picker
- **Default**: Today
- **Required**: Yes

### Item Section

#### Add Item Button
- **Icon**: ➕ Plus
- **Label**: "+ Add Item"
- **Style**: Outlined button
- **Action**: Adds new row to items array

#### Item Row Fields
1. **Item Name** - Text/Dropdown
2. **Description** - Textarea
3. **Quantity** - Number (min: 1)
4. **Unit** - Dropdown (Pcs, Kg, Meter, etc.)
5. **Rate** - Number (per unit price)
6. **Amount** - Calculated (Qty × Rate)
7. **Remove Button** - 🗑️ Trash icon

### Calculations Section

#### Subtotal
- **Formula**: Sum of all item amounts
- **Read-only**: Yes

#### Discount Toggle
- **Type**: Checkbox
- **Label**: "Apply Discount"
- **Shows**: Discount input when checked

#### Discount Input
- **Type**: Number or Percentage
- **Options**: Fixed amount or percentage
- **Applied to**: Subtotal

#### Tax Selection
- **Options**:
  - No Tax
  - GST 5%
  - GST 12%
  - GST 18%
  - GST 28%
  - Custom Tax
- **Applied to**: Subtotal after discount

#### Total Amount
- **Formula**: (Subtotal - Discount) + Tax
- **Display**: Large, bold
- **Read-only**: Yes

### Terms & Conditions
- **Type**: Textarea
- **Rows**: 5
- **Default**: Standard terms
- **Editable**: Yes

### Footer Buttons

#### Save Draft Button
- **Icon**: 💾 Save
- **Label**: "Save Draft"
- **Style**: White background, blue text
- **Action**: 
  - Save PO as draft (not sent)
  - API: `POST /api/v1/purchase-orders`
  - Body: `{ ...poData, status: 'draft' }`
  - Stays on page
  - Shows: "Draft saved successfully!"

#### Send to Vendor Button
- **Icon**: 📧 Send
- **Label**: "Send to Vendor"
- **Style**: Blue-900 background
- **Action**:
  - Save PO as sent
  - API: `POST /api/v1/purchase-orders`
  - Body: `{ ...poData, status: 'sent' }`
  - Creates notification for vendor
  - Navigate to: `/purchase-orders`
  - Shows: "PO sent to vendor successfully!"

---

# SOR Module

## Page: SOR List
**URL**: `http://localhost:5174/sor`  
**Route**: `/sor`

### Purpose
Statement of Requirements management and tracking.

### Top Buttons

#### Filter Dropdown
- **Options**: All, Pending, Approved, Rejected

#### Create SOR
- **Icon**: ➕ Plus
- **Label**: "Create SOR"
- **Destination**: `http://localhost:5174/sor/create`

### SOR Table
| Column | Content |
|--------|---------|
| SOR # | SOR-XXXX |
| Title | Requirement title |
| Department | Department name |
| Created By | User name |
| Status | Badge |
| Actions | View, Edit |

---

## Page: SOR Workspace
**URL**: `http://localhost:5174/sor/workspace/:id`  
**Route**: `/sor/workspace/:id`  
**Example**: `http://localhost:5174/sor/workspace/SOR-0001`

### Purpose
Digital workspace for creating and managing Statement of Requirements.

### Layout
```
┌──────────────────────────────────────────┐
│  [← Back] SOR-0001 | Draft      [⚙️]    │
├──────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐                   │
│  │Stats Stats Stats                     │
│  └────┘ └────┘ └────┘                   │
├──────────────────────────────────────────┤
│  [Overview] [Logs] [Permissions]         │
├──────────────────────────────────────────┤
│                                          │
│  [Main Content Area]                     │
│  - Item list                             │
│  - Specifications                        │
│  - Budget                                │
│                                          │
├──────────────────────────────────────────┤
│  [Save Draft] [Submit for Approval]      │
└──────────────────────────────────────────┘
```

### Top Bar

#### Back Button
- **Icon**: ← ChevronLeft
- **Label**: "Back"
- **Destination**: `/sor`

#### SOR Info
- **SOR Number**: SOR-XXXX
- **Status Badge**: Draft/Pending/Approved/Rejected

#### Settings Button
- **Icon**: ⚙️ Settings
- **Action**: Opens settings menu

### Stats Cards
1. **Total Items** - Count of requirement items
2. **Estimated Budget** - Total budget
3. **Days Open** - Days since creation

### Tabs

#### Overview Tab
Main SOR content:
- Item requirements list
- Specifications
- Justification
- Budget breakdown

#### Logs Tab
Audit trail:
- Creation time
- Edits
- Approvals/Rejections
- Comments

#### Permissions Tab
Access control:
- Who can view
- Who can edit
- Who can approve

### Footer Actions

#### Save Draft
- **Icon**: 💾 Save
- **Action**: Save without submitting
- **API**: `PUT /api/v1/sor/:id`

#### Submit for Approval
- **Icon**: ✓ Check
- **Action**: Submit to approvers
- **API**: `PUT /api/v1/sor/:id/submit`
- **Creates**: Notification for approvers

---

# Inventory Module

## Page: Inventory List
**URL**: `http://localhost:5174/inventory`  
**Route**: `/inventory`

### Purpose
Track component inventory and stock levels.

### Top Buttons

#### Filter
- **Options**: All, Low Stock, Out of Stock

#### Add Component
- **Icon**: ➕ Plus
- **Destination**: Opens Add Component Modal

### Inventory Table
| Column | Content |
|--------|---------|
| Component Code | COMP-XXX |
| Name | Component name |
| Category | Category |
| Stock | Quantity |
| Unit | Pcs/Kg/etc |
| Location | Bin number |
| Status | In Stock/Low/Out |
| Actions | View, Edit |

### Row Actions

#### View Details
- **Shows**: Component specifications, history

#### Edit Component
- **Opens**: Edit modal

#### Adjust Stock
- **Action**: Add/Remove stock
- **Opens**: Stock adjustment modal

---

# Production Module

## Page: Production Schedule
**URL**: `http://localhost:5174/production`  
**Route**: `/production`

### Features
- Timeline view of production
- Schedule management
- Resource allocation

---

## Page: Material Receive
**URL**: `http://localhost:5174/production/receive`  
**Route**: `/production/receive`

### Purpose
Record incoming materials from vendors.

### Form Fields
1. **PO Number** - Select from list
2. **Vendor** - Auto-filled from PO
3. **Received Date** - Date picker
4. **Items** - List from PO with receive quantity
5. **Quality Check** - Pass/Fail checkboxes
6. **Remarks** - Textarea

### Buttons
- **Save** - Record receipt
- **Cancel** - Discard

---

## Page: Material Dispatch
**URL**: `http://localhost:5174/production/dispatch`  
**Route**: `/production/dispatch`

### Purpose
Record outgoing materials to production or customers.

---

# Settings

## Page: Settings
**URL**: `http://localhost:5174/settings`  
**Route**: `/settings`

### Layout
```
┌──────────────────────────────────────────┐
│  Settings                                │
├──────────────────────────────────────────┤
│  [Profile] [Security] [Notifications]    │
│  [Preferences] [About]                   │
├──────────────────────────────────────────┤
│                                          │
│  [Tab Content]                           │
│                                          │
│                                          │
│                    [Save Changes]        │
└──────────────────────────────────────────┘
```

### Tabs

#### Profile Tab
Fields:
1. **Name** - Text input
2. **Email** - Email input (read-only)
3. **Phone** - Tel input
4. **Department** - Dropdown
5. **Role** - Display only

#### Security Tab
Features:
1. **Change Password**
   - Current password
   - New password
   - Confirm password
2. **Two-Factor Auth** - Toggle
3. **Active Sessions** - List with revoke option

#### Notifications Tab
Preferences:
1. **Email Notifications** - Toggle
2. **Push Notifications** - Toggle
3. **Notification Types**:
   - Order updates
   - Payment alerts
   - Vendor activity
   - System announcements

#### Preferences Tab
Settings:
1. **Language** - Dropdown (English, Hindi)
2. **Date Format** - DD-MM-YYYY, MM-DD-YYYY
3. **Currency** - INR (Indian Rupee)
4. **Timezone** - Asia/Kolkata

#### About Tab
Information:
- App version
- Last updated
- License info
- Support contact

### Save Changes Button
- **Position**: Bottom right
- **Style**: Blue-900 background
- **Action**: 
  - API: `PUT /api/v1/users/me`
  - Shows: "Settings saved successfully!"

---

# Common Components

## Header
**Present on**: All pages

### Components

#### 1. Logo
- **Location**: Left side (in sidebar on desktop)
- **Image**: SMG logo
- **Clickable**: Yes → `/dashboard`

#### 2. Search Bar
- **Location**: Center
- **Icon**: 🔍 Search
- **Placeholder**: "Search anything..."
- **Width**: 400px
- **Functionality**: Global search across modules

#### 3. Notifications Bell
- **Icon**: 🔔 Bell
- **Badge**: Red dot if unread notifications
- **Action**: Opens notification dropdown
- **API**: `GET /api/v1/notifications?limit=10`

#### 4. User Menu
- **Display**: User avatar + name
- **Dropdown Options**:
  - Profile → `/settings?tab=profile`
  - Settings → `/settings`
  - Logout → Clears token, redirects to `/login`

## Sidebar
**Present on**: All pages (collapsible on mobile)

### Navigation Items

| Icon | Label | URL |
|------|-------|-----|
| 📊 | Dashboard | `/dashboard` |
| 👥 | Vendors | `/vendor/list` |
| 📦 | Purchase Orders | `/purchase-orders` |
| 💰 | Payments | `/payments` |
| 🧾 | SOR | `/sor` |
| 📋 | Orders | `/orders` |
| 📚 | Components | `/inventory` |
| 🏭 | Production | `/production` |
| ⚙️ | Settings | `/settings` |

### Active State
- **Background**: Blue-900
- **Text**: White
- **Border**: Left blue border (4px)

---

# URL Routing Summary

## Complete Route Map

```
/                           → Redirect to /dashboard
/login                      → Login page
/dashboard                  → Dashboard home

/vendor/list                → Vendor list
/vendor/onboarding          → Create vendor (4-step wizard)
/vendor/details/:id         → Vendor details with tabs

/purchase-orders            → PO list
/purchase-orders/create     → Create PO
/purchase-orders/:id        → PO details

/payments                   → Payment list
                            (Create modal on same page)

/orders                     → Order history
                            (Details modal on same page)

/sor                        → SOR list
/sor/create                 → Create SOR
/sor/workspace/:id          → SOR workspace

/inventory                  → Component inventory

/production                 → Production schedule
/production/receive         → Material receive
/production/dispatch        → Material dispatch

/settings                   → Settings (with tabs)
/settings?tab=profile       → Profile tab
/settings?tab=security      → Security tab
/settings?tab=notifications → Notifications tab
```

---

**Documentation Version**: 2.0  
**Last Updated**: December 23, 2025  
**Coverage**: 95% of UI complete  
**Total Pages Documented**: 20+  
**Total Buttons Documented**: 100+
