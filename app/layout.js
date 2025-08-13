import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FS Finance",
  description: "Your personal finance tracker",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          {/* {header} */}
          <Header />

          
          {/* {main content} */}
          <main className="min-h-screen">{children}</main>


          {/* {footer} */}
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center">
              <p>This is the footer made by me</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
