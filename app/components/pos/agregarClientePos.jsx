import HtmlButton from "@/app/components/HtmlHelpers/Button";
import { Check, UserCheck, X } from "lucide-react";
import { useState } from "react";
import AgregarCliente from "../clientes/agregarCliente";
import ModalTemplate from "../HtmlHelpers/ModalTemplate";

export default function AgregarCLientePos({ open, onClose }) {
    const [modalAgregarCliente, onModal_AgregarCliente] = useState(false);  // Estado para controlar el modal de agregar cliente

    const onClose_This = () => {
        onClose();
    };

    // Modal para confirmar si se desea crear el cliente
    const modalChild = (
        <>
            <p className="text-md text-gray-800 dark:text-gray-100">
                No existe el cliente ¿Desea crearlo?
            </p>
            <form className="my-2 w-full flex flex-col items-center">
                <div className="flex justify-center gap-6 mt-5">
                    <HtmlButton
                        color={"green"}
                        legend={"Aceptar"}
                        icon={Check}
                        onClick={() => {
                            onModal_AgregarCliente(true);  // Abre el segundo modal
                            onClose(); // Cierra el primer modal
                        }}
                    />
                    <HtmlButton
                        color={"red"}
                        legend={"Cancelar"}
                        icon={X}
                        onClick={onClose}
                    />
                </div>
            </form>
        </>
    );

    return (
        <>
            {/* Primer modal: Confirmar si desea agregar un cliente */}
            <ModalTemplate
                open={open}
                onClose={onClose}
                icon={UserCheck}
                title={"Agregar Cliente"}>
                <>
                    <p className="text-md text-gray-800 dark:text-gray-100">
                        No existe el cliente ¿Desea crearlo?
                    </p>
                    <form className="my-2 w-full flex flex-col items-center">
                        <div className="flex justify-center gap-6 mt-5">
                            <HtmlButton
                                color={"green"}
                                legend={"Aceptar"}
                                icon={Check}
                                onClick={() => {
                                    onModal_AgregarCliente(true);  // Abre el segundo modal
                                    onClose(); // Cierra el primer modal
                                }}
                            />
                            <HtmlButton
                                color={"red"}
                                legend={"Cancelar"}
                                icon={X}
                                onClick={onClose}
                            />
                        </div>
                    </form>
                </>
                </ModalTemplate>

            {/* Segundo modal: Agregar cliente */}
            {modalAgregarCliente && (
                <AgregarCliente
                    onClose={() => {
                        onModal_AgregarCliente(false);  // Cierra el segundo modal
                    }}
                    open={modalAgregarCliente}
                />
            )}
        </>
    );
}
