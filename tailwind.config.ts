import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bunny: {
                    pink: '#FFB6C1',
                    purple: '#DDA0DD',
                    white: '#FFF5F7',
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
