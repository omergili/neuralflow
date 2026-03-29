import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://neuralflow.mylurch.com"),
  title: "NeuralFlow — EU AI Act Compliance Scanner | Kostenlos prüfen",
  description: "Ist deine Website AI Act konform? 16 Compliance-Checks nach Art. 50, 11 und 13. Kostenloser Scan in Sekunden. Enforcement ab 02.08.2026.",
  alternates: {
    canonical: "https://neuralflow.mylurch.com",
  },
  openGraph: {
    title: "NeuralFlow — EU AI Act Compliance Scanner",
    description: "Scanne jede Website auf EU AI Act Compliance. 16 Checks, gewichtetes Scoring A-F, Fix-Empfehlungen. Kostenlos.",
    type: "website",
    url: "https://neuralflow.mylurch.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
