# App Build Runbook - Authentic TH

This document provides the commands required to build and run the different variants of the Authentic TH applications.

## 📱 Customer App
**Location:** `apps/customer-app`

The customer app uses environment-based variants defined in `app.config.js`.

### 1. Local Development
Run the app in development mode for a specific restaurant:

**Siam Authentic:**
```bash
cd apps/customer-app
APP_VARIANT=siam_authentic npm run ios # or npm run android
```

**Thai Breeze Express:**
```bash
cd apps/customer-app
APP_VARIANT=thai_breeze npm run ios # or npm run android
```

### 2. Production Builds (EAS)
Use Expo Application Services (EAS) to build signed binaries.

**Siam Authentic:**
```bash
cd apps/customer-app
APP_VARIANT=siam_authentic eas build --platform ios
APP_VARIANT=siam_authentic eas build --platform android
```

**Thai Breeze Express:**
```bash
cd apps/customer-app
APP_VARIANT=thai_breeze eas build --platform ios
APP_VARIANT=thai_breeze eas build --platform android
```

## 🛠️ Restaurant App
*(Note: Implementation pending/Not yet found in current directory structure)*

## 📋 General Notes
- **Environment Variables:** Ensure `APP_VARIANT` is set correctly before any build or start command.
- **Prerequisites:** 
  - Node.js
  - Expo CLI (`npm install -g expo-cli`)
  - EAS CLI (`npm install -g eas-cli`)
  - Logged into Expo account (`eas login`)
