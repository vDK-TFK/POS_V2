'use client';
import { useState, useEffect } from 'react';
import { X, CircleAlert } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function DeleteRol({ open, onClose, roleId, mutate }) {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchRole = async () => {
            if (roleId) {
                try {
                    const response = await fetch(`/api/role/${roleId}`);
                    const result = await response.json();
                    if (response.ok) {
                        setRole(result);
                    } else {
                        toast.error('Error al obtener los datos del rol');
                    }
                } catch (error) {
                    toast.error('Error al obtener los datos del rol');
                }
            }
        };

        fetchRole();
    }, [roleId]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/role/${roleId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (response.ok) {
                toast.success('Rol eliminado con éxito');
                mutate('/api/role');
                onClose();
            } else {
                toast.error('Error al eliminar el rol');
            }
        } catch (error) {
            console.error("Error al eliminar el rol:", error);
            toast.error('Error al eliminar el rol');
        }
    };

    if (!open) {
        return null; // Evitar renderizar el modal si no está abierto
    }

    return (
        <div className="fixed inset-0 overflow-y-auto overflow-x-hidden flex justify-center items-center z-50 bg-black bg-opacity-20">
            <div className="relative bg-white rounded-lg shadow-xl transition-all transform scale-100 opacity-100 w-full max-w-md">
                <button type="button" className="absolute top-3 right-3 p-2 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600" onClick={onClose}>
                    <X />
                </button>
                <div className="p-6 text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">¿Seguro que desea eliminar este rol?</h3>
                    {role && (
                        <div className="text-gray-800 text-md">
                            <p><span className="font-bold">ID:</span> {roleId}</p>
                            <p><span className="font-bold">Descripción:</span> {role.Descripcion}</p>
                        </div>
                    )}
                    <div className="mt-8 flex justify-center gap-4">
                        <button className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5" onClick={handleDelete}>
                            Si, estoy seguro
                        </button>
                        <button className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700" onClick={onClose}>
                            No, cancelar
                        </button>
                    </div>
                </div>
            </div>
            <Toaster richColors />
        </div>
    );
}
