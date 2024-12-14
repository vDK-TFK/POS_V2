'use client';

import { useState, useEffect } from 'react';
import { Trash, X, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import ModalTemplate from '../HtmlHelpers/ModalTemplate';
import HtmlButton from '../HtmlHelpers/Button';

export default function EliminarProducto({ open, onClose, productoId, onReload }) {
    const [producto, setProducto] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (open && productoId) {
            fetchProducto();
        }
    }, [open, productoId]);

    const fetchProducto = async () => {
        setIsLoading(true);
        setIsError(false);

        try {
            const response = await fetch(`/api/inventario/${productoId}`);
            if (!response.ok) throw new Error('Error al obtener el producto');

            const { data } = await response.json();
            setProducto(data || null);
        } catch (error) {
            console.error('Error al cargar el producto:', error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEliminar = async () => {
        try {
            const response = await fetch(`/api/inventario/${productoId}`, {
                method: 'DELETE',
            });

            const { status, message } = await response.json();

            if (status === 'success') {
                toast.success(message || 'Producto eliminado satisfactoriamente');
                if (onReload) onReload();
                onClose();
            } else {
                toast.error(message || 'Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            toast.error('Error al conectar con el servidor');
        }
    };

    if (isLoading) {
        return (
            <ModalTemplate
                open={open}
                onClose={onClose}
                title="Cargando..."
                icon={AlertCircle}
                children={<p className="text-center text-gray-700 dark:text-gray-200">Cargando datos del producto...</p>}
            />
        );
    }

    if (isError) {
        return (
            <ModalTemplate
                open={open}
                onClose={onClose}
                title="Error"
                icon={AlertCircle}
                children={<p className="text-center text-gray-700 dark:text-gray-200">Error al cargar los datos del producto.</p>}
            />
        );
    }

    const modalChildren = (
      <div className="flex flex-col items-center space-y-6 p-4">
        {/* Título del mensaje */}
        <p className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
          ¿Está seguro de que desea eliminar este producto de forma lógica?
        </p>
    
        {/* Información del producto */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <InfoRow label="Nombre" value={producto?.Nombre || "N/A"} />
        </div>
    
        {/* Botones de acción */}
        <div className="w-full flex flex-col sm:flex-row justify-end items-center gap-4">
          <HtmlButton
            onClick={handleEliminar}
            color="red"
            icon={Trash}
            legend="Eliminar"
            additionalClass="w-full sm:w-auto"
          />
          <HtmlButton
            onClick={onClose}
            color="gray"
            icon={X}
            legend="Cancelar"
            additionalClass="w-full sm:w-auto"
          />
        </div>
      </div>
    );
    

    return (
        <ModalTemplate
            open={open}
            onClose={onClose}
            title="Eliminar Producto"
            icon={AlertCircle}
            children={modalChildren}
        />
    );
}

/* Componente reutilizable para mostrar filas de información */
const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-md font-bold text-gray-800 dark:text-gray-200">{label}:</span>
        <span className="text-md text-gray-800 dark:text-gray-300">{value || 'N/A'}</span>
    </div>
);
