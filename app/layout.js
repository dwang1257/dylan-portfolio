import "./globals.css";
import { icon } from "@fortawesome/fontawesome-svg-core";

export const metadata = {
  title: "Dylan Wang",
  description: "Dylan Wang's personal portfolio showcasing projects and skills.",
  icon: "/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

