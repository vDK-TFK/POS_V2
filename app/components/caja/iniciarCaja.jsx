import { Check, CircleAlert, InfoIcon } from "lucide-react";
import { Toaster } from 'sonner';
import HtmlButton from "../HtmlHelpers/Button";
import ModalTemplate from "../HtmlHelpers/ModalTemplate";
import { InfoCircledIcon } from "@radix-ui/react-icons";


export default function IniciarCaja({ open, onClose }) {




   const getItemValue = (id) => {
      return document.getElementById(id).value;
   }

   async function aperturarCaja() {
      window.location.href = '/dashboard/caja';
   }

   const modalChild = (
      <>
         <p className="text-md text-gray-800 dark:text-gray-100">
            No existe una caja abierta.
         </p>
         <p className="text-md text-gray-800 dark:text-gray-100">
            Debe aperturar una caja para poder facturar
         </p>
         <form className="my-2 w-full flex flex-col items-center">
            <div className="flex justify-center gap-6 mt-5">
               <HtmlButton onClick={aperturarCaja} color={"green"} legend={"Aperturar Caja"} icon={Check} />
            </div>
         </form>
      </>

   );

   return (
      <ModalTemplate icon={InfoIcon} onClose={onClose} open={open} title={"Iniciar Caja"}>
         <p className="text-md text-gray-800 dark:text-gray-100">
            No existe una caja abierta.
         </p>
         <p className="text-md text-gray-800 dark:text-gray-100">
            Debe aperturar una caja para poder facturar
         </p>
         <form className="my-2 w-full flex flex-col items-center">
            <div className="flex justify-center gap-6 mt-5">
               <HtmlButton onClick={aperturarCaja} color={"green"} legend={"Aperturar Caja"} icon={Check} />
            </div>
         </form>
      </ModalTemplate>
   );
}