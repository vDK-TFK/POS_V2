import { Check, CircleAlert } from "lucide-react";
import { Toaster } from 'sonner';
import HtmlButton from "../HtmlHelpers/Button";


export default function IniciarCaja({ open, onClose }) {




   const getItemValue = (id) => {
      return document.getElementById(id).value;
   }

   async function aperturarCaja() {
      window.location.href= '/dashboard/caja';
   }

   return (
      <div
         className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}>
         <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} max-w-3xl w-full md:w-2/3 lg:w-4/12`}>

            <div className="flex flex-col items-center">
               <div className="text-center w-full">
                  <h2 className="text-xl font-bold flex gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
                     <CircleAlert />Iniciar Caja
                  </h2>
                  <hr className="my-3 py-0.5  border-black dark:border-white" />
                  <p className="text-md text-gray-800 dark:text-gray-100">
                     No existe una caja abierta.
                  </p>
                  <p className="text-md text-gray-800 dark:text-gray-100">
                     Debe aperturar una caja para poder facturar
                  </p>
                  
               </div>
               <form className="my-2 w-full flex flex-col items-center">
                  <div className="flex justify-center gap-6 mt-5">
                     <HtmlButton onClick={aperturarCaja} color={"green"} legend={"Aperturar Caja"} icon={Check} />

                  </div>
               </form>
            </div>
         </div>
         <Toaster richColors />
      </div>
   );
}