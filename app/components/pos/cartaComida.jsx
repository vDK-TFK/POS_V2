import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import HtmlTableButton from "../HtmlHelpers/TableButton";
import EditarProdVenta from "./editarProdVenta";
import EliminarProdVenta from "./eliminarProdVenta";
import Image from "next/image";
import HtmlNewLabel from "../HtmlHelpers/Label1";

export default function CartaComida({ producto, reloadTable, agregarProductoTabla }) {
  const [modalEliminar, openModalEliminar] = useState(false);
  const [modalEditar, openModalEditar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  return (
    <div className="max-w-xs border bg-white dark:bg-gray-800 p-4 flex flex-col items-center rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="w-20 h-20 flex justify-center items-center overflow-hidden rounded-lg">
        <Image
          src={producto.imagen}
          width={200}
          height={200}
          alt={""}
          className="object-contain w-full h-full"
        />
      </div>
      <h2 className="mt-2 text-lg font-bold dark:text-white text-center">{producto.nombre}</h2>
      
      <div className="mt-2">
        <HtmlNewLabel  color={"zinc"} legend={"₡ " + producto.precio}/>

      </div>
      <div className="mt-2">
        <HtmlNewLabel  color={Number(producto.cantMinima) > Number(producto.cantDisponible) ? 'red' : 'blue'} legend={"Cantidad: " + producto.cantDisponible}/>
      </div>


      <div className="flex justify-between items-center mt-2 w-full">
        <HtmlTableButton tooltip={"Eliminar Producto"} color={"red"} icon={Trash} onClick={() => { openModalEliminar(true); setProductoSeleccionado(producto); }} />
        <HtmlTableButton tooltip={"Editar Producto"} color={"blue"} icon={Pencil} onClick={() => { openModalEditar(true); setProductoSeleccionado(producto); }} />
        {Number(producto.cantDisponible) >= Number(producto.cantMinima) && (
          <HtmlTableButton tooltip={"Agregar Producto"} color={"green"} icon={Plus} onClick={() => agregarProductoTabla(producto)} />
        )}
      </div>
      <EliminarProdVenta onClose={() => openModalEliminar(false)} open={modalEliminar} reloadTable={reloadTable} productoVenta={productoSeleccionado} />
      <EditarProdVenta onClose={() => openModalEditar(false)} open={modalEditar} reloadProducts={reloadTable} productoVenta={productoSeleccionado} />
    </div>
  );
}
