import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/features/Providers/themeProvider";
import Header from "@/widgets/Header/Header";
import { SelectedNodesProvider } from "@/features/Roadmap/Nodes/SelectedNodesContext";

const golos = Golos_Text({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanDSTU",
  description: "Нейросеть для помощи студентам",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={golos.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SelectedNodesProvider>
            <div className="min-h-screen bg-app-bg">
              <Header />
              <main>{children}</main>
            </div>
          </SelectedNodesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
