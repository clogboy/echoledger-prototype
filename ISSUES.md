# EchoLedger Code Issues

## Critical Issues 🚨

### FE-002: Missing Next.js Configuration
- **File**: `frontend/`
- **Issue**: Frontend now uses Next.js but was missing essential configuration files.
- **Priority**: High
- **Status**: Resolved

### PORT-001: Frontend Port Mismatch
- **File**: `frontend/package.json`, `.replit`
- **Issue**: Frontend dev script previously used port 3000, now confirms alignment with backend on port 8080.
- **Priority**: Medium
- **Status**: Resolved

## Medium Priority Issues ⚠️

### NAV-001: Missing Navigation
- **File**: Frontend pages
- **Issue**: No navigation between registration pages.
- **Priority**: Medium
- **Status**: Open
- **Fix**: Add navigation component or menu.

### API-003: Hardcoded API URLs
- **File**: `frontend/private/pages/*.jsx`
- **Issue**: API calls use relative URLs that may not work in all environments.
- **Priority**: Medium
- **Status**: Open
- **Fix**: Use environment variables for API base URL.

### STORAGE-001: Temporary In-Memory Storage
- **File**: `backend/main.py`
- **Issue**: Uses temporary storage that resets on server restart.
- **Priority**: Medium
- **Status**: Open
- **Fix**: Implement persistent storage backend.

## Low Priority Issues 📝

### STYLE-001: Inconsistent Form Styling
- **File**: Multiple form components
- **Issue**: Different className patterns across forms.
- **Priority**: Low
- **Status**: Open
- **Fix**: Create unified CSS classes.

### WALLET-001: Burner Wallet Persistence
- **File**: `frontend/shared/ui/WalletProvider.js`
- **Issue**: Burner wallets are regenerated on page refresh.
- **Priority**: Low
- **Status**: Open
- **Fix**: Add session storage for burner wallet persistence.

### CONFIG-001: Missing Environment Configuration
- **File**: Project root
- **Issue**: No environment-specific configuration.
- **Priority**: Low
- **Status**: Open
- **Fix**: Add .env files for different environments.

## Recently Resolved Issues ✅

### IMPORT-001: Missing Dependencies ✅
- **Resolution**: Added comprehensive package.json with all required dependencies.
- **Resolved**: Current session.

### FE-001: Unused Wallet Integration ✅
- **Resolution**: Both registration forms now properly use WalletProvider.
- **Resolved**: Current session.

### API-001: Endpoint Mismatch ✅
- **Resolution**: Unified API endpoints to use `/api/` prefix.
- **Resolved**: Previous session.

### API-002: Duplicate API Handlers ✅
- **Resolution**: Unified model that handles both frontend formats.
- **Resolved**: Previous session.

### CORS-001: Missing CORS Configuration ✅
- **Resolution**: Added proper CORS middleware.
- **Resolved**: Previous session.

## TODO Items

- [ ] Add navigation between registration pages (NAV-001)
- [ ] Configure environment-based API URLs (API-003)
- [ ] Implement persistent storage backend (STORAGE-001)
- [ ] Add session persistence for burner wallets (WALLET-001)
- [ ] Create unified CSS styling system (STYLE-001)
- [ ] Add environment configuration files (CONFIG-001)