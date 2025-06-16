import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { ColorModeProvider, LightMode } from "@/components/ui/color-mode";
import { AppProvider } from "./context/AppContext";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bitacora de Eventos TIC",
  description: "Bitacora de eventos TIC",
};

export default function RootLayout({ children }) {
  
  return (
    <html suppressHydrationWarning lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <AppProvider>
            <ColorModeProvider>
                {children}
            </ColorModeProvider>
          </AppProvider>
        </Provider>
      </body>
    </html>
  );
}
