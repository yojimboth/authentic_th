export default ({ config }) => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

  return {
    expo: {
      name: "Restaurant Manager",
      slug: "authentic-restaurant-app",
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
        bundleIdentifier: "com.authentic.restaurant",
        supportsTablet: true,
      },
      android: {
        package: "com.authentic.restaurant",
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
      },
      web: {
        favicon: "./assets/favicon.png",
      },
      extra: {
        apiUrl: API_BASE_URL,
      },
    },
  };
};