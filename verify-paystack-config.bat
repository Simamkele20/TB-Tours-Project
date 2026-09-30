@echo off
REM Paystack Integration Configuration Verification Script (Windows)
REM TB Tours Payment System

setlocal enabledelayedexpansion
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Paystack Integration Configuration Verification          ║
echo ║   TB Tours Payment System                                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Color codes won't work in batch, so we'll use simple output
set CHECKS_PASSED=0
set CHECKS_FAILED=0

REM Function to check file exists
:check_file
set file=%~1
set description=%~2
echo Checking: %description%...
if exist "%file%" (
    echo   [PASS] Found: %file%
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Not found: %file%
    set /a CHECKS_FAILED+=1
)
exit /b

:====== START CHECKS ======

echo.
echo ════ PHASE 1: PROJECT STRUCTURE ════
if exist "backend\package.json" (
    echo   [PASS] Backend exists
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Backend not found
    set /a CHECKS_FAILED+=1
)

if exist "frontend\package.json" (
    echo   [PASS] Frontend exists
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Frontend not found
    set /a CHECKS_FAILED+=1
)

if exist "backend\.env.develop" (
    echo   [PASS] Backend .env file exists
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Backend .env file not found
    set /a CHECKS_FAILED+=1
)

if exist "frontend\src\environments\environment.ts" (
    echo   [PASS] Frontend environment file exists
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Frontend environment file not found
    set /a CHECKS_FAILED+=1
)

echo.
echo ════ PHASE 2: BACKEND CONFIGURATION ════
if exist "backend\.env.develop" (
    findstr /M "PAYSTACK_SECRET_KEY" backend\.env.develop >nul
    if !errorlevel! equ 0 (
        echo   [PASS] Paystack Secret Key configured
        set /a CHECKS_PASSED+=1
    ) else (
        echo   [FAIL] Paystack Secret Key not found
        set /a CHECKS_FAILED+=1
    )
    
    findstr /M "PAYSTACK_PUBLIC_KEY" backend\.env.develop >nul
    if !errorlevel! equ 0 (
        echo   [PASS] Paystack Public Key configured
        set /a CHECKS_PASSED+=1
    ) else (
        echo   [FAIL] Paystack Public Key not found
        set /a CHECKS_FAILED+=1
    )
    
    findstr /M "FRONTEND_URL" backend\.env.develop >nul
    if !errorlevel! equ 0 (
        echo   [PASS] Frontend URL configured
        set /a CHECKS_PASSED+=1
    ) else (
        echo   [FAIL] Frontend URL not found
        set /a CHECKS_FAILED+=1
    )
)

echo.
echo ════ PHASE 3: FRONTEND COMPONENTS ════
if exist "frontend\src\app\pages\booking\booking-page.component.ts" (
    echo   [PASS] Booking component found
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Booking component not found
    set /a CHECKS_FAILED+=1
)

if exist "frontend\src\app\pages\booking\payment-callback.component.ts" (
    echo   [PASS] Payment callback component found (NEW)
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Payment callback component not found
    set /a CHECKS_FAILED+=1
)

if exist "frontend\src\app\services\paystack.service.ts" (
    echo   [PASS] Paystack service found
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Paystack service not found
    set /a CHECKS_FAILED+=1
)

echo.
echo ════ PHASE 4: BACKEND ROUTES ════
if exist "backend\src\routes\bookings.js" (
    echo   [PASS] Bookings route found
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Bookings route not found
    set /a CHECKS_FAILED+=1
)

if exist "backend\src\routes\payments.js" (
    echo   [PASS] Payments route found
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Payments route not found
    set /a CHECKS_FAILED+=1
)

if exist "backend\src\payments\paystack.js" (
    echo   [PASS] Paystack service module found
    set /a CHECKS_PASSED+=1
) else (
    echo   [FAIL] Paystack service module not found
    set /a CHECKS_FAILED+=1
)

echo.
echo ════ PHASE 5: BACKEND DEPENDENCIES ════
if exist "backend\node_modules" (
    echo   [PASS] Backend node_modules installed
    set /a CHECKS_PASSED+=1
) else (
    echo   [WARNING] Backend node_modules not installed
    echo            Run: cd backend ^&^& npm install
)

if exist "frontend\node_modules" (
    echo   [PASS] Frontend node_modules installed
    set /a CHECKS_PASSED+=1
) else (
    echo   [WARNING] Frontend node_modules not installed
    echo            Run: cd frontend ^&^& npm install
)

echo.
echo ════ PHASE 6: TEST KEYS VERIFICATION ════
if exist "backend\.env.develop" (
    findstr /I "sk_test_" backend\.env.develop >nul
    if !errorlevel! equ 0 (
        echo   [PASS] Secret key in test mode (sk_test_)
        set /a CHECKS_PASSED+=1
    ) else (
        echo   [FAIL] Secret key not in test mode
        set /a CHECKS_FAILED+=1
    )
    
    findstr /I "pk_test_" backend\.env.develop >nul
    if !errorlevel! equ 0 (
        echo   [PASS] Public key in test mode (pk_test_)
        set /a CHECKS_PASSED+=1
    ) else (
        echo   [FAIL] Public key not in test mode
        set /a CHECKS_FAILED+=1
    )
)

echo.
echo ════ PHASE 7: PAYMENT CALLBACK ROUTE ════
if exist "frontend\src\app\app.routes.ts" (
    findstr /I "payment-callback" frontend\src\app\app.routes.ts >nul
    if !errorlevel! equ 0 (
        echo   [PASS] Payment callback route configured
        set /a CHECKS_PASSED+=1
    ) else (
        echo   [FAIL] Payment callback route not found
        set /a CHECKS_FAILED+=1
    )
)

echo.
echo ════ SUMMARY ════
echo.
echo Checks Passed: %CHECKS_PASSED%
echo Checks Failed: %CHECKS_FAILED%
echo.

if %CHECKS_FAILED% equ 0 (
    echo [SUCCESS] All checks passed!
    echo Your Paystack integration is configured and ready to test.
    echo.
    echo Next steps:
    echo 1. Open two command prompts
    echo 2. First:  cd backend ^& npm start
    echo 3. Second: cd frontend ^& npm start
    echo 4. Browser will open to http://localhost:4200
    echo 5. Follow testing checklist: PAYSTACK_TESTING_CHECKLIST.md
    echo.
    pause
    exit /b 0
) else (
    echo [ERROR] Some checks failed!
    echo Please fix the issues above before testing.
    echo.
    echo See PAYSTACK_INTEGRATION_COMPLETE.md for troubleshooting.
    echo.
    pause
    exit /b 1
)
