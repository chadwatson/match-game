import { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="overflow-hidden w-screen h-screen select-none">
      {children}
    </main>
  );
}
