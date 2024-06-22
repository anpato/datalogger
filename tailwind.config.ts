import type { Config } from 'tailwindcss';
import { content, plugin } from 'flowbite-react/tailwind';
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}', content()],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: [plugin()]
} satisfies Config;
