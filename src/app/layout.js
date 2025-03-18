import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import Script from "next/script";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"]
});

export const metadata = {
  title: "たこポー",
  description: "たこ焼き屋検索サイト",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "たこポー"
  },
  icons: {
    icon: '/takoyaki.png',
    shortcut: '/takoyaki.png',
    apple: '/takoyaki.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/takoyaki.png',
    },
  }
};

export const viewport = {
  themeColor: "#FF9900",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/takoyaki.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/takoyaki.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/takoyaki.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/takoyaki.png" />
        <link rel="mask-icon" href="/takoyaki.png" color="#FF9900" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="msapplication-TileImage" content="/takoyaki.png" />
        <meta name="msapplication-TileColor" content="#FF9900" />
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
        <Script src="/sw-register.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
