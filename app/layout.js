import { Merriweather_Sans } from "next/font/google";
import "./globals.css";
import { icon } from "@fortawesome/fontawesome-svg-core";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
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
      <body className={`${merriweatherSans.variable} font-merriweather-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

