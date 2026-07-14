export default ({ config }) => {
  // Load the variant from environment variables
  const APP_VARIANT = process.env.APP_VARIANT || 'siam_authentic';
  
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
        eas: {
          projectId: "your-eas-project-id",
        },
      },
    },
  };
};
