/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#F7F6F3",
        surface: "#FFFFFF",
        "surface-2": "#F0EEE9",
        border: "#E2DFD8",
        ink: "#1A1A1A",
        muted: "#6B6862",
        primary: "#1F2A37",
        accent: "#B5522B",
        success: "#2F7D4F",
        warning: "#B7791F",
        danger: "#B42318",
      },
      fontFamily: {
        sans: ["IBMPlexSans_400Regular"],
        medium: ["IBMPlexSans_500Medium"],
        semibold: ["IBMPlexSans_600SemiBold"],
        mono: ["IBMPlexMono_400Regular"],
        "mono-medium": ["IBMPlexMono_500Medium"],
      },
      fontSize: {
        xs: ["12px", "18px"],
        sm: ["14px", "21px"],
        base: ["16px", "24px"],
        lg: ["20px", "24px"],
        xl: ["24px", "29px"],
        "2xl": ["32px", "38px"],
      },
      borderRadius: {
        DEFAULT: "6px",
        card: "10px",
      },
    },
  },
  plugins: [],
};
