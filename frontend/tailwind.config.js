/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Exo 2'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        void: "#050a14",
        panel: "#0b1628",
        card: "#0f1e35",
        border: "#1a2f4a",
        accent: {
          cyan: "#00e5ff",
          green: "#00ff94",
          amber: "#ffb800",
          red: "#ff3d5a",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(0,229,255,0.25), 0 0 60px rgba(0,229,255,0.08)",
        "neon-green": "0 0 20px rgba(0,255,148,0.25), 0 0 60px rgba(0,255,148,0.08)",
      },
    },
  },
  plugins: [],
};
