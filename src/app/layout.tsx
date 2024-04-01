import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "SF Housing",
  description: "City and County of San Francisco",
	icons: ["data:;base64,iVBORw0KGgo="],
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
