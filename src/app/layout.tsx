import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SF Housing",
  description: "City and County of San Francisco",
		// try to make next.js stop requesting a favicon
	icons: null,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
