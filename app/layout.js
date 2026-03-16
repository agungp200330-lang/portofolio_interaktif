import { Playfair_Display, Montserrat, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["700", "800"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Agung Prayogi | Full-Stack Developer & Data Analyst",
  description: "Agung Prayogi — Full-Stack Developer & Data Analyst specializing in PHP (Laravel), Python, and Data Visualization.",
  authors: [{ name: "Agung Prayogi" }],
  openGraph: {
    title: "Agung Prayogi | Full-Stack Developer & Data Analyst",
    description: "Portfolio of Agung Prayogi — Crafting robust web systems and data-driven insights.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
