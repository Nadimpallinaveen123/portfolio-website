export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#111827',
        surface: '#f7f8fb',
        accent: '#0f766e',
        amberline: '#d97706'
      },
      boxShadow: {
        enterprise: '0 16px 48px rgba(15, 23, 42, 0.14)'
      }
    }
  },
  plugins: []
};

