'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import RoleTable from "../../components/seguridad/roles";


export default function SeguridadGeneral() {

    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div>Cargando...</div>;
    }

    if (status === 'error') {
        return <div>Error al cargar la sesión</div>;
    }

    if (!session || session.user.role !== 'Administrador') {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 text-center">No estás autorizado para ver esta página.</p>
            </div>
        );
    }

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
                <div className="px-4 mx-auto max-w-screen-2xl lg:px-12">
                </div>
                <main className="bg-gray-50 dark:bg-gray-900 p-4 md:ml-64 lg:mr-16 min-h-full pt-20">
                    <div className="grid grid-cols-3 gap-4 mb-4"></div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Comienza divisiones */}
                        <div className="rounded-lg dark:border-gray-600">
                            <RoleTable />
                        </div>
                    </div>
                </main>
            </section>
        </>
    );
}
