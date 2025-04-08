import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ParallaxGridEffect from "./components/ParallaxGridEffect";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caleb Mills | Full Stack Developer",
  description: "Portfolio website showcasing my skills and projects as a full stack developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getInitialColorMode() {
                  const persistedColorPreference = window.localStorage.getItem('theme');
                  const hasPersistedPreference = typeof persistedColorPreference === 'string';
                  
                  if (hasPersistedPreference) {
                    return persistedColorPreference;
                  }
                  
                  const mql = window.matchMedia('(prefers-color-scheme: dark)');
                  const hasMediaQueryPreference = typeof mql.matches === 'boolean';
                  
                  if (hasMediaQueryPreference) {
                    return mql.matches ? 'dark' : 'light';
                  }
                  
                  return 'light';
                }
                
                const colorMode = getInitialColorMode();
                document.documentElement.classList.toggle('dark', colorMode === 'dark');
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} cyber-grid`}>
        {children}
        <ParallaxGridEffect />
      </body>
    </html>
  );
}
