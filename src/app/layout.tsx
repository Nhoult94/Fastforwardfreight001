// src/app/layout.tsx
import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fast Forward Freight",
  description: "Instant freight quoting from China to NZ & AU",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#65cbf4] text-black`}>
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAqkqevKsb7QO7HMdAsPKZel6qGUbwNl7U&libraries=places"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
