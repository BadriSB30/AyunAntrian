// src/app/layout.jsx
import { Geist } from "next/font/google";
import "../styles/globals.css"; // Tailwind + custom CSS
import { Providers } from "./providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata = {
  title: "AyunAntrian-V1.0.0",
  description: "AyunAntrian-V1.0.0",
  icons: {
    icon: "/favicon.png", // /public/favicon.png → cukup /favicon.png
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={geistSans.variable}>
      <body className="antialiased transition-colors duration-300 bg-gradient-to-bl from-slate-400 to-red-200">
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
