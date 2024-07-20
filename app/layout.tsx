import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/app/app/_Components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "login App",
  description: "login app by reza azarnia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <Navbar />
        <main className="flex w-full h-screen ">
          <div className="grid w-full h-full">{children}</div>
        </main>
      </body>
    </html>
  );
}
