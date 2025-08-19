import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SaarthiProvider } from "@/context/SaarthiContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SaarthiAI",
  description:
    "Your AI Saarthi, here to guide you through the wisdom of the Gita.",
  icons: {
    icon: "favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SaarthiProvider>{children}</SaarthiProvider>
      </body>
    </html>
  );
}
