export default ({ config }) => {
  // Load the variant from environment variables
  const APP_VARIANT = process.env.APP_VARIANT || 'siam_authentic';
  
  // SECURITY: Load environment-based configuration with safe defaults
  // SECURITY: SSL pinning should be implemented in production builds.
  // Configure via expo-config-plugin or custom native code to prevent
  // man-in-the-middle attacks on public networks.
  // See: https://docs.expo.dev/guides/security/
  // For now, ensure all API calls use HTTPS (enforced by Axios configuration)
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8113';
  const ENABLE_BIOMETRIC = process.env.ENABLE_BIOMETRIC_AUTH === 'true';
  const ENABLE_AUDIT_LOGGING = process.env.ENABLE_AUDIT_LOGGING === 'true';

  // Define variants for Expo (Name, Bundle ID, etc.)
  const variants = {
    siam_authentic: {
      name: "Siam Authentic",
      bundleIdentifier: "com.authentic.siam",
      package: "com.authentic.siam",
    },
    thai_breeze: {
      name: "Thai Breeze Express",
      bundleIdentifier: "com.authentic.breeze",
      package: "com.authentic.breeze",
    },
  };

  const variant = variants[APP_VARIANT] || variants.siam_authentic;

  return {
    expo: {
      name: variant.name,
      slug: "authentic-customer-app",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      ios: {
        bundleIdentifier: variant.bundleIdentifier,
        supportsTablet: true,
      },
      android: {
        package: variant.package,
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
      },
      extra: {
        appVariant: APP_VARIANT,
        apiUrl: API_BASE_URL,
        enableBiometricAuth: ENABLE_BIOMETRIC,
        enableAuditLogging: ENABLE_AUDIT_LOGGING,
        eas: {
          projectId: "your-eas-project-id",
        },
      },
    },
  };
};
