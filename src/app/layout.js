import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"]
});

export const metadata = {
  title: "たこポー",
  description: "たこ焼き屋検索サイト",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
      </head>
      <body
        className={notoSansJP.className}
        style={{ backgroundColor: "#FFF8F2" }}
      >
        <AuthProvider>
          <Header />
            {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
