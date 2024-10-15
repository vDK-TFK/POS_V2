import { Roboto } from "next/font/google";
import "../globals.css";

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata = {
  title: "Login",
  description: "Página login Petote",
};

export default function LoginLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <div className="w-full h-screen flex flex-col">
          {children}

        </div>
      </body>
    </html>

  );
}
