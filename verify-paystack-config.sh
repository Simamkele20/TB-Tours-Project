#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Paystack Integration Configuration Verification          ║${NC}"
echo -e "${BLUE}║   TB Tours Payment System                                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Track passes and failures
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check and report
check_config() {
    local check_name=$1
    local check_command=$2
    local expected=$3
    
    echo -n "Checking: $check_name... "
    
    if eval "$check_command" &> /dev/null; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} - Expected: $expected"
        ((CHECKS_FAILED++))
    fi
}

# Function to verify file exists
check_file_exists() {
    local file_path=$1
    local description=$2
    
    echo -n "Checking: $description... "
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}✓ PASS${NC} ($file_path)"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (File not found: $file_path)"
        ((CHECKS_FAILED++))
    fi
}

# Function to check environment variable
check_env_var() {
    local var_name=$1
    local description=$2
    local env_file=$3
    
    echo -n "Checking: $description... "
    
    if grep -q "^$var_name=" "$env_file" 2>/dev/null; then
        local value=$(grep "^$var_name=" "$env_file" | cut -d'=' -f2)
        echo -e "${GREEN}✓ PASS${NC} (Set to: ${value:0:20}...)"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Not found in $env_file)"
        ((CHECKS_FAILED++))
    fi
}

echo -e "${BLUE}════ PHASE 1: PROJECT STRUCTURE ════${NC}"
check_file_exists "./backend/package.json" "Backend exists"
check_file_exists "./frontend/package.json" "Frontend exists"
check_file_exists "./backend/.env.develop" "Backend .env file"
check_file_exists "./frontend/src/environments/environment.ts" "Frontend environment file"
echo ""

echo -e "${BLUE}════ PHASE 2: BACKEND CONFIGURATION ════${NC}"
check_env_var "PAYSTACK_SECRET_KEY" "Paystack Secret Key configured" "./backend/.env.develop"
check_env_var "PAYSTACK_PUBLIC_KEY" "Paystack Public Key configured" "./backend/.env.develop"
check_env_var "FRONTEND_URL" "Frontend URL configured" "./backend/.env.develop"
check_env_var "PAYSTACK_CALLBACK_URL" "Callback URL configured" "./backend/.env.develop"
check_env_var "MYSQL_DATABASE" "MySQL database configured" "./backend/.env.develop"
check_env_var "JWT_SECRET" "JWT Secret configured" "./backend/.env.develop"
echo ""

echo -e "${BLUE}════ PHASE 3: FRONTEND CONFIGURATION ════${NC}"
check_file_exists "./frontend/src/app/pages/booking/booking-page.component.ts" "Booking component"
check_file_exists "./frontend/src/app/pages/booking/payment-callback.component.ts" "Payment callback component (NEW)"
check_file_exists "./frontend/src/app/services/paystack.service.ts" "Paystack service"
echo ""

echo -e "${BLUE}════ PHASE 4: BACKEND ROUTES ════${NC}"
check_file_exists "./backend/src/routes/bookings.js" "Bookings route"
check_file_exists "./backend/src/routes/payments.js" "Payments route"
check_file_exists "./backend/src/payments/paystack.js" "Paystack service module"
echo ""

echo -e "${BLUE}════ PHASE 5: DATABASE MODELS ════${NC}"
check_file_exists "./backend/src/models/Booking.js" "Booking model"
check_file_exists "./backend/src/models/User.js" "User model"
check_file_exists "./backend/src/models/Tour.js" "Tour model"
echo ""

echo -e "${BLUE}════ PHASE 6: ENVIRONMENT VARIABLES CHECK ════${NC}"

# Check specific test keys
echo ""
echo -n "Checking: Secret key starts with 'sk_test_'... "
if grep -q "^PAYSTACK_SECRET_KEY=sk_test_" "./backend/.env.develop"; then
    echo -e "${GREEN}✓ PASS${NC} (Test mode confirmed)"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Should start with sk_test_ for development)"
    ((CHECKS_FAILED++))
fi

echo -n "Checking: Public key starts with 'pk_test_'... "
if grep -q "^PAYSTACK_PUBLIC_KEY=pk_test_" "./backend/.env.develop"; then
    echo -e "${GREEN}✓ PASS${NC} (Test mode confirmed)"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Should start with pk_test_ for development)"
    ((CHECKS_FAILED++))
fi

echo -n "Checking: Frontend public key matches backend... "
if grep -q "pk_test_39961bd3d5a124c5636be980de3a124489f922d5" "./frontend/src/environments/environment.ts"; then
    echo -e "${GREEN}✓ PASS${NC} (Keys match)"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Frontend key doesn't match backend)"
    ((CHECKS_FAILED++))
fi

echo -n "Checking: Mock payment mode enabled for testing... "
if grep -q "^USE_MOCK_PAYMENT=true" "./backend/.env.develop"; then
    echo -e "${GREEN}✓ PASS${NC} (Mock mode for safe testing)"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Mock mode disabled - will use real Paystack API)"
fi

echo ""
echo -e "${BLUE}════ PHASE 7: PAYMENT CALLBACK CONFIGURATION ════${NC}"

echo -n "Checking: Payment callback route exists... "
if grep -q "payment-callback" "./frontend/src/app/app.routes.ts"; then
    echo -e "${GREEN}✓ PASS${NC} (Route configured)"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Route not found in app.routes.ts)"
    ((CHECKS_FAILED++))
fi

echo -n "Checking: Callback component imported... "
if grep -q "PaymentCallbackComponent" "./frontend/src/app/app.routes.ts"; then
    echo -e "${GREEN}✓ PASS${NC} (Component imported)"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Component not imported)"
    ((CHECKS_FAILED++))
fi

echo -n "Checking: Callback URL set in backend... "
if grep -q "payment-callback" "./backend/.env.develop"; then
    echo -e "${GREEN}✓ PASS${NC} (Callback URL configured)"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Default callback URL may not be set)"
fi

echo ""
echo -e "${BLUE}════ PHASE 8: NODE MODULES ════${NC}"

echo -n "Checking: Backend node_modules... "
if [ -d "./backend/node_modules" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Installed)"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Not installed - run: cd backend && npm install)"
fi

echo -n "Checking: Frontend node_modules... "
if [ -d "./frontend/node_modules" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Installed)"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Not installed - run: cd frontend && npm install)"
fi

echo ""
echo -e "${BLUE}════ PHASE 9: PORT AVAILABILITY ════${NC}"

echo -n "Checking: Port 4000 (Backend)... "
if ! lsof -i :4000 &>/dev/null; then
    echo -e "${GREEN}✓ AVAILABLE${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}⚠ IN USE${NC} (Kill process before starting backend)"
fi

echo -n "Checking: Port 4200 (Frontend)... "
if ! lsof -i :4200 &>/dev/null; then
    echo -e "${GREEN}✓ AVAILABLE${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}⚠ IN USE${NC} (Kill process before starting frontend)"
fi

echo -n "Checking: Port 3306 (MySQL)... "
if lsof -i :3306 &>/dev/null; then
    echo -e "${GREEN}✓ RUNNING${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠ NOT RUNNING${NC} (Start MySQL before testing)"
fi

echo ""
echo -e "${BLUE}════ SUMMARY ════${NC}"
echo ""
echo -e "Checks Passed: ${GREEN}${CHECKS_PASSED}${NC}"
echo -e "Checks Failed: ${RED}${CHECKS_FAILED}${NC}"

echo ""
if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}Your Paystack integration is configured and ready to test.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start Backend:   cd backend && npm start"
    echo "2. Start Frontend:  cd frontend && npm start"
    echo "3. Open Browser:    http://localhost:4200"
    echo "4. Follow testing checklist: PAYSTACK_TESTING_CHECKLIST.md"
    echo ""
    exit 0
else
    echo -e "${RED}✗ SOME CHECKS FAILED${NC}"
    echo -e "${RED}Please fix the issues above before testing.${NC}"
    echo ""
    echo "See PAYSTACK_INTEGRATION_COMPLETE.md for troubleshooting."
    echo ""
    exit 1
fi
