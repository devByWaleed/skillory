import type { Metadata } from "next";
import "./globals.css";
import { Poppins, Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/Theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import ClientWrapper from "./components/ClientWrapper";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export const metadata: Metadata = {
  title: "ELearning LMS",
  description: "LMS Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${josefin.variable} duration-300`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <ClientWrapper>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}