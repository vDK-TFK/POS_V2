'use client'
import { Check, Circle, CircleAlert, Clock, MessageSquare, X } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import HtmlButton from '../HtmlHelpers/Button';
import { useState } from 'react';
import { FormatDate, FormatDate12Hours } from '@/app/api/utils/js-helpers';
import HtmlNewLabel from '../HtmlHelpers/Label1';
import HtmlTextArea from '../HtmlHelpers/TextArea';


const AgregarNota = ({ open, onClose, idAsistencia, onGet_Asistencia }) => {
  const [observacion, setObservation] = useState("");
  const [onLoading, onSet_Loading] = useState(false);

  const [formData, setFormData] = useState({
    observacion:""
  });

  
  // Manejador de cambio en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const onAdd_Notas = async () => {
    try {
      const response = await fetch(`/api/marcar/${idAsistencia}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ observacion: observacion }),
      });

      if (response.ok) {
        toast.success('Nota registrada con éxito');
        setTimeout(() => {
          onGet_Asistencia();
        });
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error('Error al registrar nota');
    }

    setObservation("");
  };

  return (
    <>
      <div
        className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}>
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} max-w-3xl w-full md:w-2/3 lg:w-4/12`}>

          <div className="flex flex-col items-center">
            <div className="text-center w-full">
              <h2 className="text-xl font-bold flex gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
                <MessageSquare /> Agregar Observación o Comentario
              </h2>
            </div>
            <form method='PUT' className="my-1 w-full">
              <div className="mt-2 grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
                <HtmlTextArea value={formData.observacion} additionalClass={"fc-nota"} name={"observacion"} colSize={1} legend={"Agregar Observación"} onChange={handleChange} />
              </div>


              {onLoading ? (
                <div className="flex items-center justify-center m-1">
                  <ClipLoader size={30} speedMultiplier={1.5} />
                </div>
              ) : (
                <>
                  <div className="flex justify-center gap-6 mt-5">
                    <HtmlButton type='submit' color={"green"} legend={"Agregar"} icon={Check} />
                    <HtmlButton onClick={onClose} color={"gray"} legend={"Cancelar"} icon={X} />
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgregarNota;
