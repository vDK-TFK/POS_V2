"use client";
import useSWR from 'swr';

export default function RegistroAuditoria() {

    const { data, error, mutate } = useSWR(`/api/audit`, async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Listado Auditoría: " + data);
        return data;
    });

    function RespaldarBase() {
        let url = "/backups";
        window.location.href = url;
    }

    return (
        <>
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <button
                                type="button"
                                onClick={RespaldarBase}
                                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                                Respaldar Base de Datos
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">
                                        Id Auditoría
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Fecha
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Hora
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Usuario
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Mensaje
                                    </th>
                                </tr>
                            </thead>
                            {data && data.map((item) => {
                                const fecha = new Date(item.FechaLogin);

                                return (
                                    <tr className="" key={item.IdAuditoriaLogin}>
                                        <td className="px-4 py-3">{item.IdAuditoriaLogin}</td>
                                        <td className="px-4 py-3">{item.Status}</td>
                                        <td className="px-4 py-3">{fecha.toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{fecha.toLocaleTimeString()}</td>
                                        <td className="px-4 py-3">{item.Usuario}</td>
                                        <td className="px-4 py-3">{item.Mensaje}</td>
                                    </tr>
                                );
                            })}
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
