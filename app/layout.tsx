// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "مصنع الإبداع للملابس | تصنيع ملابس ويونيفورم بجودة احترافية",
  description:
    "مصنع متخصص في تصنيع الملابس الرجالي والحريمي والأطفال واليونيفورم. نقدم خدمة تصنيع عينات أولية خلال 72 ساعة، إنتاج كميات صغيرة وكبيرة، مع تشطيب ثابت وجودة مضمونة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 -left-64 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#2c3e50",
              borderRadius: "16px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: "500",
              direction: "rtl",
            },
            success: {
              style: {
                background: "#10b981",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#10b981",
              },
            },
            error: {
              style: {
                background: "#ef4444",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#ef4444",
              },
            },
          }}
        />
      </body>
    </html>
  );
}