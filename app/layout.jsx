import './globals.css'; // Asegúrate de importar los estilos globales

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>POS - Soda Santa Ana</title>
            </head>
            <body className="bg-gray-100 text-gray-900">
                {children}
            </body>
        </html>
    );
}
