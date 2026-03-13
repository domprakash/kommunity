/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A8A',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F1F5F9',
          foreground: '#475569',
        },
        accent: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        warning:     { DEFAULT: '#F59E0B', foreground: '#FFFFFF' },
        destructive: { DEFAULT: '#EF4444', foreground: '#FFFFFF' },
        muted:       { DEFAULT: '#F8FAFC', foreground: '#64748B' },
        background:  '#F8FAFC',
        foreground:  '#0F172A',
        card:        { DEFAULT: '#FFFFFF', foreground: '#0F172A' },
        border:      '#E2E8F0',
        input:       '#FFFFFF',
        ring:        '#2563EB',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { xl: '0.75rem', '2xl': '1rem', '3xl': '1.5rem' },
      boxShadow: {
        card:       '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover':'0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        mobile:     '0 -4px 24px 0 rgb(0 0 0 / 0.08)',
      },
      animation: {
        'slide-up':   'slideUp 0.3s ease-out',
        'fade-in':    'fadeIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideUp: { '0%': { transform:'translateY(10px)', opacity:'0' }, '100%': { transform:'translateY(0)', opacity:'1' } },
        fadeIn:  { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
      },
    },
  },
  plugins: [],
}
