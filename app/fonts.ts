import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-bricolage" });
const body = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });

export const fontVariables = `${display.variable} ${body.variable}`;
