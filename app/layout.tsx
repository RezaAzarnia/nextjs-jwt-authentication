import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { auth } from "./_lib/auth";
import Navbar from "@/app/app/_Components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import "./_styles/globals.css";

const inter = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "login App",
  description: "login app by reza azarnia",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex w-full h-screen ">
            <div className="grid w-full h-full">{children}</div>
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
