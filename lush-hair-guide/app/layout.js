import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "LUSH Scalp Scan & Hair Consultation Guide",
  description: "Bộ công cụ hướng dẫn sử dụng máy soi da đầu và chẩn đoán phân loại da đầu LUSH",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${outfit.variable} ${playfairDisplay.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

