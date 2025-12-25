# [BUG] Warranty Claims Not Saving to Database

## Priority
🔴 **HIGH** - Core functionality broken

## Module
**Warranty Claims** (`/warranty-claims`)

## Description
Warranty claims show success message and send notifications, but **do not save to MongoDB database**. The `warranties` collection remains empty (0 documents) despite successful form submissions.

## Expected Behavior
1. User fills warranty claim form
2. Clicks "Submit Warranty Claim"
3. Claim saves to MongoDB `warranties` collection
4. Claim appears in warranty claims list
5. Success notification shows

## Actual Behavior
1. ✅ User fills warranty claim form
2. ✅ Clicks "Submit Warranty Claim"  
3. ❌ Claim **DOES NOT** save to MongoDB
4. ❌ List shows "No warranty claims found"
5. ✅ Success notification shows (false positive)

## Evidence

### Screenshots
1. **Success Message Displayed**
   ![Success Toast](file:///C:/Users/ASUS/.gemini/antigravity/brain/88e68529-1f52-4d48-abad-c31ba0eaf57e/uploaded_image_0_1766507374227.png)

2. **Empty Database**
   ![MongoDB Empty](file:///C:/Users/ASUS/.gemini/antigravity/brain/88e68529-1f52-4d48-abad-c31ba0eaf57e/uploaded_image_2_1766507374227.png)

### Backend Terminal
- **NO error logs shown**
- Silent failure - no indication of what's wrong

## Steps to Reproduce
1. Login to vendor portal
2. Navigate to Warranty Claims → New Claim
3. Fill in required fields:
   - Component Name: "Battery Pack"
   - Failure Description: "Battery not charging"
   - Customer Name, Vehicle details, etc.
4. Click "Submit Warranty Claim"
5. Check MongoDB Compass → `warranties` collection
6. **Result**: Collection is empty (0 documents)

## Technical Details

### Affected Files
- `backend/controllers/warrantyController.js` - Create claim endpoint
- `backend/models/Warranty.js` - Mongoose schema
- `src/services/warrantyClaimService.js` - Frontend API service
- `src/pages/WarrantyClaims/WarrantyClaimForm.jsx` - Form component

### API Endpoint
- **POST** `/api/v1/warranty`
- **Auth**: Required (Bearer token)

### Previous Attempts
1. ❌ Removed notification helper code (was failing on non-existent import)
2. ✅ Fixed import syntax in `warrantyClaimService.js` (default → named import)
3. ✅ Fixed API endpoint paths (added `/v1/` prefix)
4. ❌ **Still not saving**

## Hypothesis
1. **Schema validation failing** - Field name mismatch or missing required fields
2. **Database connection issue** - Wrong DB or collection permissions
3. **Middleware blocking** - Auth/validation rejecting before controller
4. **Silent error in controller** - Error caught but success returned

## Environment
- **Backend**: Node.js + Express + Mongoose
- **Database**: MongoDB (local)
- **Frontend**: React + Vite
- **OS**: Windows

## Related Issues
None

## Debug Plan
See: [warranty_debug_plan.md](file:///C:/Users/ASUS/.gemini/antigravity/brain/88e68529-1f52-4d48-abad-c31ba0eaf57e/warranty_debug_plan.md)

---

**Status**: 🔍 Under Investigation  
**Assignee**: Unassigned  
**Labels**: `bug`, `high-priority`, `warranty-claims`, `backend`
