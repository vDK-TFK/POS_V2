import { Check, CircleAlert, Pencil, X } from "lucide-react";
import HtmlButton from "../HtmlHelpers/Button";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import ModalTemplate from "../HtmlHelpers/ModalTemplate";

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

  const modalChild = (
    <>
      <p className="text-md text-gray-800 dark:text-gray-100">
        ¿Está seguro que desea {legend.toLowerCase()} el {entitySingular}?
      </p>
      <form className="my-2 w-full flex flex-col items-center">
        <div className="w-full">
          {
            onLoading ? (
              <div className="flex items-center justify-center mt-20">
                <ClipLoader size={30} speedMultiplier={1.5} />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-4 mt-4">
                <HtmlButton onClick={actionToExecute} color={"green"} legend={legend} icon={Check} />
                <HtmlButton onClick={onClose} color={"red"} legend={"Cancelar"} icon={X} />
              </div>
            )
          }
        </div>

      </form>
    </>

  );

  const titleModal = legend + " " + entitySingular + " " + "#" + idType;

  return (
    <ModalTemplate open={open} onClose={onClose} icon={Pencil} title={titleModal}>
      <>
        <p className="text-md text-gray-800 dark:text-gray-100">
          ¿Está seguro que desea {legend.toLowerCase()} el {entitySingular}?
        </p>
        <form className="my-2 w-full flex flex-col items-center">
          <div className="w-full">
            {
              onLoading ? (
                <div className="flex items-center justify-center mt-20">
                  <ClipLoader size={30} speedMultiplier={1.5} />
                </div>
              ) : (
                <div className="flex justify-center items-center gap-4 mt-4">
                  <HtmlButton onClick={actionToExecute} color={"green"} legend={legend} icon={Check} />
                  <HtmlButton onClick={onClose} color={"red"} legend={"Cancelar"} icon={X} />
                </div>
              )
            }
          </div>

        </form>
      </>
    </ModalTemplate>
  )

 
}