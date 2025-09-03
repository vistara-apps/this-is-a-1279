/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(260, 82%, 60%)',
        secondary: 'hsl(150, 70%, 50%)',
        accent: 'hsl(38, 92%, 58%)',
        success: 'hsl(142, 72%, 36%)',
        warning: 'hsl(45, 100%, 50%)',
        error: 'hsl(0, 84%, 60%)',
        background: 'hsl(210, 20%, 12%)',
        surface: 'hsl(210, 15%, 18%)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(210, 20%, 8%, 0.08)',
        popover: '0 8px 24px hsla(210, 20%, 8%, 0.12)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom right, hsl(260, 82%, 60%), hsl(38, 92%, 58%))',
      },
      transitionDuration: {
        fast: '100ms',
        base: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [],
}