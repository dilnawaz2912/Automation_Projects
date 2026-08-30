# SauceDemo Login Test Plan

## Application Overview

Test plan for the SauceDemo login page at https://www.saucedemo.com/login. Includes seed setup reference and a set of independent test scenarios covering happy paths, negative cases, security checks, accessibility, and UI/responsiveness. Assumes a fresh browser context for each scenario.

## Test Scenarios

### 1. SauceDemo Login

**Seed:** `tests/seed.spec.ts`

#### 1.1. Valid login — standard_user

**File:** `tests/saucedemo.valid-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/login
    - expect: Login page loads with username and password fields visible
    - expect: Login button is visible and enabled
  2. Enter username 'standard_user' and password 'secret_sauce'
    - expect: Input values are set correctly
  3. Click the Login button
    - expect: User is redirected to inventory page (/inventory.html)
    - expect: Inventory page shows product list and shopping cart icon
    - expect: No error messages are shown

#### 1.2. Invalid login — wrong password

**File:** `tests/saucedemo.invalid-wrong-password.spec.ts`

**Steps:**
  1. Navigate to login page (fresh context)
    - expect: Login page visible
  2. Enter username 'standard_user' and password 'wrong_password'
    - expect: Inputs reflect entered values
  3. Click Login
    - expect: Login fails and an error toast/message appears containing 'Username and password do not match any user in this service' or similar
    - expect: User remains on login page

#### 1.3. Invalid login — locked_out_user

**File:** `tests/saucedemo.lockedout.spec.ts`

**Steps:**
  1. Navigate to login page
    - expect: Login page visible
  2. Enter username 'locked_out_user' and password 'secret_sauce'
    - expect: Inputs reflect entered values
  3. Click Login
    - expect: Login fails and an error message appears indicating the user is locked out
    - expect: User cannot proceed to inventory page

#### 1.4. Empty credentials validation

**File:** `tests/saucedemo.empty-credentials.spec.ts`

**Steps:**
  1. Navigate to login page
    - expect: Login page visible
  2. Leave username and password empty and click Login
    - expect: Validation message or error appears
    - expect: User remains on login page
  3. Enter username only, leave password empty and click Login
    - expect: Validation/error appears indicating password is required
  4. Enter password only, leave username empty and click Login
    - expect: Validation/error appears indicating username is required

#### 1.5. Password field masking and reveal

**File:** `tests/saucedemo.password-mask.spec.ts`

**Steps:**
  1. Navigate to login page
    - expect: Password field is of type 'password' (masked) by default
  2. Type a password into the field
    - expect: Characters are masked visually
  3. If a reveal toggle exists, click it
    - expect: Password becomes visible (type='text') and toggling again masks it back

#### 1.6. Logout and session end

**File:** `tests/saucedemo.logout.spec.ts`

**Steps:**
  1. Log in successfully as 'standard_user'
    - expect: Inventory page visible
  2. Click the menu (hamburger) and choose Logout
    - expect: User is redirected to login page
    - expect: Any protected inventory page is inaccessible without re-login

#### 1.7. Brute-force/lockout rate-limiting (negative security)

**File:** `tests/saucedemo.brute-force.spec.ts`

**Steps:**
  1. From a fresh context, attempt multiple rapid failed logins for the same username (5–10 attempts)
    - expect: Application either rate-limits, adds delay, or returns a consistent error without revealing user enumeration details
    - expect: No sensitive server errors or stack traces exposed

#### 1.8. Input sanitization — injection attempts

**File:** `tests/saucedemo.injection.spec.ts`

**Steps:**
  1. Enter common injection payloads in username and password fields (e.g., "' OR '1'='1", `<script>alert(1)</script>`) and submit
    - expect: Login fails (no bypass)
    - expect: No script execution occurs in the client
    - expect: Errors are user-friendly and do not expose stack traces

#### 1.9. Accessibility smoke checks

**File:** `tests/saucedemo.accessibility.spec.ts`

**Steps:**
  1. Open login page with screen-reader settings / keyboard only navigation
    - expect: All interactive elements reachable via keyboard (Tab order logical)
    - expect: Form fields have accessible labels or aria-labels
    - expect: Error messages are announced and tied to inputs (aria-describedby)

#### 1.10. Responsive layout — mobile viewport

**File:** `tests/saucedemo.responsive.spec.ts`

**Steps:**
  1. Set viewport to a common mobile size (e.g., 375x812) and open login page
    - expect: Layout adapts without overlapping controls
    - expect: All inputs and buttons remain usable and visible
    - expect: Hamburger/menu (if present) is functional
