// The one place fonts are loaded. Applied as CSS variables on <html> by layout.tsx and on the story
// root by .storybook/preview.tsx; globals.css maps them to Tailwind's font-sans / font-display.
// Components never import this file: they write `font-display`.
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-bricolage" });
const body = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });

/** className that defines --font-bricolage and --font-dm-sans on the element it is applied to. */
export const fontVariables = `${display.variable} ${body.variable}`;
