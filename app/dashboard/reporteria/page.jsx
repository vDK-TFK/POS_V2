'use client';

import { useSession } from 'next-auth/react';
import TopCards from '@/app/components/reporteria/TopCards';
import BarChart from '@/app/components/reporteria/BarChart';
import BarChartProductos from '@/app/components/reporteria/BarChartProductos'; // Asegúrate de importar el nuevo componente

export default function Reporteria() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div>Cargando...</div>;
    }

    if (status === 'error') {
        return <div>Error al cargar la sesión</div>;
    }

    

    return (
        <>
            <div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
                <div>
                    <div>
                        <TopCards />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mx-auto">
                        <div className="col-span-1">
                            <div className='w-full h-full'>
                                <BarChart />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className='w-full h-full'>
                                <BarChartProductos />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
