'use client'

import { FormatDate } from "@/app/api/utils/js-helpers";
import HtmlBreadCrumb from "@/app/components/HtmlHelpers/BreadCrumb";
import HtmlButton from "@/app/components/HtmlHelpers/Button";
import HtmlFormInput from "@/app/components/HtmlHelpers/FormInput";
import HtmlLabel from "@/app/components/HtmlHelpers/Label";
import HtmlTableButton from "@/app/components/HtmlHelpers/TableButton";
import CierreCaja from "@/app/components/caja/cierreCaja";
import ListaMovimientos from "@/app/components/caja/listaMovimientos";
import VerCaja from "@/app/components/caja/verCaja";
import SpinnerOnLoading from "@/app/components/spinner";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { ArrowLeftRight, Coins, Eye } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Toaster, toast } from 'sonner';

const itemsBreadCrumb = ["Home", "Caja"];



export default function Caja() {
    const [infoCaja, setInfoCaja] = useState([]);
    const [openModalCaja, onSet_ModalCaja] = useState(false);
    const [cajaActual, onSet_CajaActual] = useState(null);
    const [existeCajaActual, onSet_ExisteCajaActual] = useState(false);
    const [openModalCierre, onSet_ModalCierre] = useState(false);
    const [openModalLista, onSet_ModalLista] = useState(false);
    const [setIdCaja, onSet_IdCaja] = useState(null);
    const toastShown = useRef(false);
    const [onLoading, onSet_onLoading] = useState(false);

    const onGet_CajaActual = useCallback(async () => {
        try {
            onSet_onLoading(true);
            const response = await fetch(`/api/current`);
            if (!response.ok) {
                throw new Error(`Error al obtener la info de caja: ${response.statusText}`);
            }
            const results = await response.json();
            if (results.data.length === 0) {
                toast.warning(results.message);
                onSet_ExisteCajaActual(false);
                onSet_CajaActual(null);
            } else {
                onSet_CajaActual(results.data);
                onSet_ExisteCajaActual(true);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Sucedió un error al obtener la info de caja');
        } finally {
            onSet_onLoading(false);
        }
    }, []); // Asegúrate de no tener ninguna dependencia externa aquí
    
    const onGet_ListaInfoCaja = useCallback(async () => {
        onSet_onLoading(true);
        try {
            const response = await fetch(`/api/caja`);
            const result = await response.json();
            if (result.status === "success") {
                setInfoCaja(result.data);
                onGet_CajaActual(); // Esto es seguro porque onGet_CajaActual es estable
            } else if (result.code === 204) {
                onGet_CajaActual(); // Esto es seguro porque onGet_CajaActual es estable
            } else {
                console.log(result.message);
                toast.error('Error al obtener los movimientos');
            }
        } catch (error) {
            console.error('Error al obtener la lista de cajas:', error);
            toast.error('Sucedió un error al obtener la lista de cajas');
        } finally {
            onSet_onLoading(false);
        }
    }, [onGet_CajaActual]); // Asegúrate de incluir onGet_CajaActual como dependencia
    
    useEffect(() => {
        if (!toastShown.current) {
            const fetchData = async () => {
                await onGet_CajaActual();
                await onGet_ListaInfoCaja();
            };
            
            fetchData();
            toastShown.current = true;
        }
    }, [onGet_CajaActual, onGet_ListaInfoCaja]); // Asegúrate de incluir ambas funciones en las dependencias
    
    

    async function onPost_InfoCaja() {
        var monto = getItemValue("txtMontoInicioCaja");
        if (monto == "") {
            toast.warning("Debe indicar un monto correcto");
        }
        else {
            let model = {
                montoInicioCaja: Number(monto)
            }

            try {
                const response = await fetch('/api/caja', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(model)
                });

                if (response.ok) {
                    const data = await response.json();
                    toast.success('Caja ha sido aperturada correctamente');
                    onSet_ExisteCajaActual(true);
                    onGet_ListaInfoCaja();
                }
                else {
                    throw new Error(`Error: ${response.statusText}`);
                }

            }
            catch (error) {
                toast.error("Sucedió un error al aperturar la caja");
                console.error(error);
            }
        }


    }

    useEffect(() => {
        if (!toastShown.current) {
            onGet_CajaActual();
            onGet_ListaInfoCaja();
        }
        toastShown.current = true;
    }, []);

    const getItemValue = (id) => {
        return document.getElementById(id).value;
    }


    return (
        <>
            <div className="w-full p-4">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="pl-2 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <HtmlBreadCrumb items={itemsBreadCrumb} />
                    </ol>
                </nav>
                <div className="p-2">
                    <h4 className="text-2xl font-bold dark:text-white">Inicio/Cierre Caja</h4>
                </div>
                {
                    onLoading ? (
                        null
                    ) : (
                        <>
                            {!existeCajaActual ? (
                                <div className="pl-4 grid grid-cols-1 md:grid-cols-12 gap-4 mx-auto">
                                    <div className="md:col-span-3">
                                        <div className="mt-1">
                                            <HtmlFormInput id={"txtMontoInicioCaja"} legend={"Monto Inicio Caja"} type={"number"} />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="mt-8">
                                            <HtmlButton onClick={() => { onPost_InfoCaja() }} color={"blue"} legend={"Iniciar Caja"} icon={Coins} />
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="mt-6 pl-4 grid grid-cols-1 md:grid-cols-12">
                                <div className="md:col-span-3">
                                    <HtmlButton color={"yellow"} onClick={() => { onSet_ModalLista(true) }} legend={"Movimientos de Dinero"} icon={ArrowLeftRight} />
                                </div>
                            </div>
                        </>
                    )
                }



                {
                    onLoading ? (
                        <SpinnerOnLoading />

                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-12 mt-8 mx-auto">
                            <div className="col-span-12">
                                <div className="relative shadow-md rounded-lg overflow-hidden">
                                    <div style={{ maxHeight: '20rem', overflowY: 'auto' }} className="relative">
                                        <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                                            <thead className="sticky top-0 text-sm text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 bg-gray-300 dark:bg-gray-700" style={{ width: '10%' }}>
                                                        No. Caja
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 bg-gray-300 dark:bg-gray-700" style={{ width: '10%' }}>
                                                        Fecha Inicio
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 bg-gray-300 dark:bg-gray-700" style={{ width: '10%' }}>
                                                        Fecha Cierre
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 bg-gray-300 dark:bg-gray-700" style={{ width: '10%' }}>
                                                        Monto Inicio
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 bg-gray-300 dark:bg-gray-700" style={{ width: '10%' }}>
                                                        Monto Cierre
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 bg-gray-300 dark:bg-gray-700" style={{ width: '10%' }}>
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {infoCaja.map((item, index) => (
                                                    item !== null && (
                                                        <tr key={index} className="bg-white dark:bg-gray-800">
                                                            <td className="px-6 py-4"># {item.idInfoCaja}</td>
                                                            <td className="px-6 py-4">
                                                                <HtmlLabel color={"green"} legend={FormatDate(item.fechaApertura)} />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {item.fechaCierre == null ? (
                                                                    <HtmlLabel color={"blue"} legend={"Caja Actual"} />
                                                                ) : (
                                                                    <HtmlLabel color={"red"} legend={FormatDate(item.fechaCierre)} />
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">₡{item.montoInicioCaja}</td>
                                                            <td className="px-6 py-4">₡{item.montoCierreCaja == null ? 0 : item.montoCierreCaja}</td>
                                                            <td className="px-6 py-4">
                                                                <HtmlTableButton color={"blue"} onClick={() => { onSet_ModalCaja(true), onSet_IdCaja(item.idInfoCaja) }} icon={Eye} />
                                                                {!item.fechaCierre && (
                                                                    <HtmlTableButton color={"red"} onClick={() => { onSet_ModalCierre(true), onSet_IdCaja(item.idInfoCaja) }} icon={LockClosedIcon} />
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>


                        </div>

                    )
                }


            </div>
            <VerCaja open={openModalCaja} idInfoCaja={setIdCaja} onClose={() => onSet_ModalCaja(false)} />
            <ListaMovimientos open={openModalLista} onClose={() => onSet_ModalLista(false)} cajaActual={cajaActual} />
            <CierreCaja open={openModalCierre} idInfoCaja={setIdCaja} onClose={() => { onSet_ModalCierre(false), onSet_CajaActual(null), onGet_ListaInfoCaja() }} />
            <Toaster richColors />
        </>
    );
}