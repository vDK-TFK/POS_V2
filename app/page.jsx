'use client';

import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import Image from 'next/image';

export default function Page() {
    const router = useRouter();

    const handleLoginRedirect = () => {
        router.push('/auth/login');
    };

    return (
        <div className="flex w-full h-screen bg-gray-100">
            {/* Sección de bienvenida y botón */}
            <div className="w-full flex flex-col justify-center items-center lg:w-1/2 px-8">
                <h1 className="text-6xl font-bold text-gray-800 mb-6">Hola al Punto de Venta</h1>
                <p className="text-2xl text-gray-600 mb-8">Bienvenido, por favor ingresa para continuar.</p>
                <button
                    onClick={handleLoginRedirect}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-xl"
                >
                    Iniciar Sesión
                </button>
            </div>
            {/* Sección de imagen */}
            <div className="rounded-l-full hidden lg:flex items-center justify-center w-1/2 h-full" style={{ backgroundColor: '#FEA81D' }}>
                <div>
                    <Image src={'/petote.png'} width={500} height={500} alt={'petote'} />
                </div>
            </div>
        </div>
    );
}
