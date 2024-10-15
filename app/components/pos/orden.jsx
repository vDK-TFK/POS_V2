'use client';
import { useState } from 'react';
import Image from "next/image";

export default function Orden() {
    const [orden, setOrden] = useState([
        { id: 1, nombre: 'Pollo frito', precio: 2000, cantidad: 2, img: '/frito.png' },
        { id: 2, nombre: 'Té Frío', precio: 1000, cantidad: 1, img: '/vaso.png' }
    ]);
    return (
        <>

            <div className="flex flex-col p-4 space-y-4 dark:bg-gray-800 dark:text-white">
                {orden.map((item) => (

                    <div key={item.id} className="grid grid-cols-4 gap-2 items-center bg-yellow-100 dark:bg-yellow-900 rounded-lg p-2">

                        <Image className="col-span-1 w-full max-w-[4rem] h-auto object-cover rounded-lg" src={item.img} alt={item.nombre} height={200} width={200} />
                        <div className="col-span-3 md:col-span-2 flex flex-col md:flex-row justify-between items-center md:items-start">
                            <div>
                                <h3 className="font-bold">{item.nombre}</h3>
                                <p className="text-xs md:text-sm">₡{item.precio}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="bg-custom-yellow hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 px-2 py-1 rounded-lg text-white">-</button>
                                <span>{item.cantidad}</span>
                                <button className="bg-custom-yellow hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 px-2 py-1 rounded-lg text-white">+</button>
                            </div>
                        </div>
                        <div className="col-span-4 md:col-span-1 text-center md:text-left mt-2 md:mt-0">
                            <button className="text-yellow-800 dark:text-yellow-400 font-bold">Remover</button>
                        </div>
                    </div>

                ))}
            </div>
        </>
    );
}
