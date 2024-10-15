import { Check, CircleAlert, X } from "lucide-react";
import HtmlButton from "../HtmlHelpers/Button";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function ModalBloquearDesbloquear({ open, onClose, isBlock, idType, onReload, entity }) {
  const [onLoading, onSet_Loading] = useState(false);
  var apiUrl = `/api/${entity}`
  var entitySingular = entity.slice(0, -1);
  var legend = isBlock ? "Bloquear" : "Desbloquear";

  //Sesion
  const { data: session } = useSession();



  const actionToExecute = async () => {
    let model = {
      id: Number(idType),
      idUsuarioModificacion: Number(session?.user.id),
      esBloquear: isBlock
    }

    onSet_Loading(true);

    try {
       const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(model)
       });

       const data = await response.json();

       if (data.status == "success") {
          toast.success(data.message)
          onReload();
          onClose();
       }
       else {
          toast.error(data.message)
       }
    }
    catch (error) {
       console.error(`Error al bloquear el ${entitySingular} :`, error);
       toast.error(`Error al bloquear el ${entitySingular}: ` + error);
    }
    finally {
       onSet_Loading(false);
    }


 }



return (
  <div
    className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}>
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} max-w-3xl w-full md:w-2/3 lg:w-4/12`}>

      <div className="flex flex-col items-center">
        <div className="text-center w-full">
          <h2 className="text-xl font-bold flex gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
            <CircleAlert />{legend} {entitySingular} #{idType}
          </h2>
          <hr className="my-3 py-0.5  border-black dark:border-white" />
          <p className="text-md text-gray-800 dark:text-gray-100">
            ¿Está seguro que desea {legend.toLowerCase()} el {entitySingular}?
          </p>

        </div>
        <form className="my-2 w-full flex flex-col items-center">
          {onLoading ? (
            <div className="flex items-center justify-center m-1">
              <ClipLoader size={30} speedMultiplier={1.5} />
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-6 mt-5">
                <HtmlButton onClick={actionToExecute} color={"green"} legend={legend} icon={Check} />
                <HtmlButton onClick={onClose} color={"gray"} legend={"Cancelar"} icon={X} />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  </div>
);
}