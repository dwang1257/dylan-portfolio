import { Inter } from "next/font/google";
import "./globals.css";
import { icon } from "@fortawesome/fontawesome-svg-core";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dylan Wang",
  description: "Dylan Wang's personal portfolio showcasing projects and skills.",
  icon: "/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  );
}

