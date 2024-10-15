import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa"; // Importar iconos de redes sociales

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center flex-wrap">
                    <div className="text-center sm:text-left">
                        <p className="text-sm">&copy; {new Date().getFullYear()} Pollo Petote. Todos los derechos reservados.</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <a href="#" className="text-gray-300 hover:text-white">Términos y Condiciones</a>
                        <a href="#" className="text-gray-300 hover:text-white">Política de Privacidad</a>
                    </div>
                    <div className="flex space-x-4 mt-2 sm:mt-0">
                        <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-white">
                            <FaTwitter size={20} />
                        </a>
                        <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-white">
                            <FaInstagram size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
