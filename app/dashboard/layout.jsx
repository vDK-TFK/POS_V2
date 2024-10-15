import { Roboto } from "next/font/google";
import Sidebar from "../components/sidebar";
import Footer from '../components/footer';
import "@/app/globals.css";
import Script from 'next/script';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import { SessionProvider } from "next-auth/react";
import Providers from "../Providers";

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata = {
  title: "Soda Santa Ana",
  description: "Restaurante",
};

export default function DashboardLayout({ children }) {
  return (
    <Providers>
      <Script src="https://kit.fontawesome.com/32bab276f2.js" crossorigin="anonymous" />
      <body className={`${roboto.className}} bg-gray-50 dark:bg-gray-900 transition-all`}>
        <NextTopLoader color="#ffff00" />
        <main className="flex overflow-hidden">
          <Sidebar />
          <div className="overflow-auto p-2 h-screen w-full">
          
            <section>{children}</section>
            
          </div>

        </main>
        <Toaster expand={true} richColors position="top-right" />
      </body>
    </Providers>
  );
}
