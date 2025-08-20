
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b10",
        card: "#12121a",
        border: "#222333",
        text: "#e7e9ea",
        muted: "#9aa0a6",
        brand: "#7c87ff",
        brand2: "#60e1ff",
        good: "#51d36a"
      },
      boxShadow: { soft: "0 8px 30px rgba(0,0,0,.25)" },
      borderRadius: { xl2: "1rem" }
    }
  },
  plugins: []
}
export default config
