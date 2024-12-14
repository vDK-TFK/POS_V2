import HtmlTableButton from "@/app/components/HtmlHelpers/TableButton";
import { Trash, Minus, Plus } from "lucide-react";
import { toast } from 'sonner';
import Image from 'next/image';

const LineaProducto = ({
    id,
    quantity,
    details,
    price,
    idProductoVenta,
    cantMinima,
    cantProducto,
    onDelete,
    onChange,
    onChangeQuantity,
    image
}) => {

    const handleChangeQuantity = (e, id, name) => {
        let newQuantity = e.target.value === "" ? null : parseInt(e.target.value, 10);

        if (isNaN(newQuantity)) {
            newQuantity = 0; // Manejo para entradas vacías o no numéricas
        }
        if (name === "cantidad" && newQuantity < 0) {
            toast.warning("No puede colocar valores negativos");
        } else if (newQuantity === 0) {
            toast.info("La línea se elimina debido a la cantidad 0");
            onDelete({ id, idProductoVenta, cantMinima, cantProducto });
        } else if (newQuantity > cantProducto + 1) {
            toast.error("No puede ordenar una cantidad mayor a la disponible");
            newQuantity = cantProducto;
        } else {
            onChangeQuantity({ id, idProductoVenta, quantity, cantProducto }, newQuantity);
        }
    };
    const handleDecreaseQuantity = () => {
        if (quantity > 0) {
            onChangeQuantity({ id, idProductoVenta, quantity, cantProducto }, quantity - 1); // Enviamos el nuevo valor al padre
        } else {
            toast.warning("No puede colocar valores negativos");
        }
    };


    const handleIncreaseQuantity = () => {
        if (quantity < cantProducto) {
            onChangeQuantity({ id, idProductoVenta, quantity, cantProducto }, quantity + 1); // Enviamos el nuevo valor al padre
        } else {
            toast.error("No puede ordenar una cantidad mayor a la disponible");
        }
    };

    return (
        <div className="grid grid-cols-3 items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            {/* Columna 1: Imagen */}
            <div className="flex justify-center items-center">
                <Image
                    src={image}
                    width={80}
                    height={80}
                    alt="Imagen del producto"
                    className="object-contain rounded-md"
                />
            </div>

            <div className="flex flex-col items-start justify-between space-y-2">
                {/* Detalles del producto: ahora es solo texto, no editable */}
                <input
                    type="text"
                    value={details}
                    onChange={(e) => onChange(e, id, 'detalles')}
                    className="dark:bg-gray-900 dark:text-white border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-35 p-1"
                />        <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={handleDecreaseQuantity}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        max={cantProducto}
                        name={"cantidad"}
                        onChange={(e) => handleChangeQuantity(e, id, 'cantidad')}
                        className="dark:bg-gray-900 dark:text-white border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-14 p-1 text-center"
                    />
                    <button
                        type="button"
                        onClick={handleIncreaseQuantity}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between p-2 space-y-2">
                {/* Precio: ahora es solo texto, no editable */}
                <div className="flex items-center space-x-1">
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => onChange(e, id, 'precio')}
                        className="dark:bg-gray-900 dark:text-white border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-16 p-1"
                    /></div>
                <HtmlTableButton
                    tooltip={"Eliminar Línea"}
                    color={"red"}
                    size={12}
                    padding={2}
                    icon={Trash}
                    onClick={() => onDelete({ id, idProductoVenta, cantMinima, quantity })}
                />
            </div>
        </div>
    );
};

export default LineaProducto;