/** @type {import('tailwindcss').Config} */
export default {
    content: ["./app/templates/**/*.html", "./assets/**/*.{js,ts,jsx,tsx}"],

    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["autumn"],
    },
};
