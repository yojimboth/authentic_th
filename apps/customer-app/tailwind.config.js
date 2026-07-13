module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FF6B00', // brand-orange
          secondary: '#F59E0B', // brand-amber
        },
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
      },
      fontFamily: {
        poppins: ['Poppins_700Bold', 'Poppins_600SemiBold', 'Poppins_500Medium'],
        inter: ['Inter_400Regular', 'Inter_500Medium', 'Inter_600SemiBold'],
      },
    },
  },
  plugins: [],
};
