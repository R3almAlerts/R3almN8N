/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        muted: 'hsl(var(--muted))', // Add for skeletons/hovers
        mutedForeground: 'hsl(var(--muted-foreground))',
        destructive: 'hsl(var(--destructive))', // For logout red
        // custom accent palette
        primary: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB'
        },
        secondary: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px'
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' // Optional for extended loadings
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }
    }
  },
  plugins: []
};