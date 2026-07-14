export default ({ config }) => {
  // Load the variant from environment variables
  const APP_VARIANT = process.env.APP_VARIANT || 'restaurant_a';
  
  // Define variants for Expo (Name, Bundle ID, etc.)
  const variants = {
    restaurant_a: {
      name: "Siam Authentic",
      bundleIdentifier: "com.authentic.siam",
      package: "com.authentic.siam",
    },
    restaurant_b: {
      name: "Thai Breeze Express",
      bundleIdentifier: "com.authentic.breeze",
      package: "com.authentic.breeze",
    },
  };

  const variant = variants[APP_VARIANT] || variants.restaurant_a;

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
