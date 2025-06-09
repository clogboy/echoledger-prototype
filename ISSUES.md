
# EchoLedger Code Issues

## Critical Issues 🚨

### API-001: Endpoint Mismatch ✅
- **File**: `frontend/private/pages/index.jsx` line 22
- **Issue**: Frontend calls `/api/register` but backend has `/register`
- **Priority**: High
- **Status**: Resolved
- **Fix**: Unified API endpoints to use `/api/` prefix

### API-002: Duplicate API Handlers ✅
- **File**: `backend/main.py`
- **Issue**: Two different register endpoints with conflicting models
- **Priority**: High
- **Status**: Resolved
- **Fix**: Unified model that handles both frontend formats

## Medium Priority Issues ⚠️

### FE-001: Unused Wallet Integration
- **File**: `frontend/private/pages/index.jsx`
- **Issue**: Form doesn't use WalletProvider despite having wallet integration
- **Priority**: Medium
- **Status**: Open
- **Fix**: Integrate wallet connection in registration form

### CONFIG-001: Workflow Path Issue
- **File**: `.replit`
- **Issue**: Run command properly configured for backend directory
- **Priority**: Low
- **Status**: Resolved

### IMPORT-001: Missing Dependencies
- **File**: `frontend/`
- **Issue**: Frontend uses ethers but no package.json
- **Priority**: Medium
- **Status**: Open
- **Fix**: Add package.json with proper dependencies

## Low Priority Issues 📝

### STYLE-001: Inconsistent Form Styling
- **File**: Multiple form components
- **Issue**: Different className patterns across forms
- **Priority**: Low
- **Status**: Open
- **Fix**: Create unified CSS classes

### CORS-001: Missing CORS Configuration ✅
- **File**: `backend/main.py`
- **Issue**: No CORS middleware for frontend-backend communication
- **Priority**: Medium
- **Status**: Resolved

## TODO Items

- [x] Unify API models and endpoints (API-001, API-002)
- [x] Set up proper CORS for frontend-backend communication (CORS-001)
- [ ] Add frontend package management (IMPORT-001)
- [ ] Integrate wallet functionality in all forms (FE-001)
- [ ] Add error handling to API calls
- [ ] Add input validation
- [ ] Add comprehensive testing
- [ ] Set up pre-commit hooks for code quality

## Resolved Issues ✅

### CONFIG-001: Workflow Path Issue
- **Resolution**: Workflow correctly configured to run from backend directory
- **Resolved**: Current
