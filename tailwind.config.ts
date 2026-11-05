import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'exam-blue': '#1a73e8',
        'exam-green': '#34a853',
        'exam-red': '#ea4335',
        'exam-purple': '#9334e6',
        'exam-orange': '#f59e0b',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
