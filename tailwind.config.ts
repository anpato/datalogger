import type { Config } from 'tailwindcss';
import { content, plugin } from 'flowbite-react/tailwind';
import typography from '@tailwindcss/typography';
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}', content()],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: [typography, plugin()]
} satisfies Config;
