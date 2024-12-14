import { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock, Pencil, Plus, X, XCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import HtmlFormInput from '../HtmlHelpers/FormInput';
import CheckButton from '../HtmlHelpers/CheckButton';
import { ClipLoader } from 'react-spinners';
import HtmlButton from '../HtmlHelpers/Button';
import { RemoveClassById } from '@/app/api/utils/js-helpers';
import ModalTemplate from '../HtmlHelpers/ModalTemplate';
import HtmlCheckButton from '../HtmlHelpers/CheckButton';


export default function EditarHorario({ open, onClose, idUsuario, onGet_ListaUsuarios }) {
  // Memoiza la inicialización de 'initialHorario'
  const initialHorario = useMemo(() => ({
    lunes: { inicio: '', fin: '', es_dia_libre: false },
    martes: { inicio: '', fin: '', es_dia_libre: false },
    miércoles: { inicio: '', fin: '', es_dia_libre: false },
    jueves: { inicio: '', fin: '', es_dia_libre: false },
    viernes: { inicio: '', fin: '', es_dia_libre: false },
    sábado: { inicio: '', fin: '', es_dia_libre: false },
    domingo: { inicio: '', fin: '', es_dia_libre: false }
  }), []);

  const [horario, onSet_Horario] = useState(initialHorario);
  const [errors, setErrors] = useState({});
  const [loadingBtn, onSet_LoadingBtn] = useState(false);
  const [loading, onSet_Loading] = useState(true);

  const onGet_HorariosByUsuario = useCallback(async () => {
    onSet_Loading(true);
    try {
      const response = await fetch(`/api/usuarios/horarios/${idUsuario}`);
      const result = await response.json();
      if (result.status === "success") {
        const horarioFormat = { ...initialHorario };

        result.data.forEach(horario => {
          const dia = horario.dia.toLowerCase();
          if (horarioFormat[dia]) {
            horarioFormat[dia] = {
              inicio: horario.inicio,
              fin: horario.fin,
              es_dia_libre: horario.esDiaLibre
            };
          }
        });
        onSet_Horario(horarioFormat);
        onSet_Loading(false);
        toast.success('Se ha obtenido el horario del usuario');
      }
      else if (result.code === 204) {
        onSet_Loading(false);
        onSet_Horario(initialHorario);
        toast.warning('No se encontraron horarios para este usuario');
      }
      else {
        console.log(result.message);
        onSet_Loading(false);
        onSet_Horario(initialHorario);
        toast.error('Error al obtener el registro: ' + result.message);

      }
    }
    catch (error) {
      onSet_Horario(initialHorario);
      onSet_Loading(false);
      console.error('Error al obtener la lista de usuarios:', error);
      toast.error('Sucedió un error al obtener el registro');

    }
    finally {
      onSet_Loading(false);
    }
  }, [idUsuario, initialHorario]);


  const handleChange = (dia, tipo, valor) => {
    onSet_Horario(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [tipo]: valor
      }
    }));
  };

  const handleDiaLibreChange = (dia) => {
    RemoveClassById("iptDiaInicio_" + dia, ["is-valid", "is-invalid"]);
    RemoveClassById("iptDiaFin_" + dia, ["is-valid", "is-invalid"]);

    onSet_Horario(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        es_dia_libre: !prev[dia].es_dia_libre,
        inicio: '',
        fin: ''
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(horario).forEach(dia => {
      const { inicio, fin, es_dia_libre } = horario[dia];
      if (!es_dia_libre) {
        if (!inicio) newErrors[`${dia}_inicio`] = 'Hora de inicio requerida';
        if (!fin) newErrors[`${dia}_fin`] = 'Hora de fin requerida';
        if (inicio && fin && inicio >= fin) newErrors[`${dia}_horario`] = 'Hora Inicio debe ser menor';
      }
    });
    setErrors(newErrors);
    toast.warning("Aún existen campos requeridos por completar...")

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (!idUsuario) {
      toast.error('No se ha proporcionado el Id del Usuario');
      return;
    }

    onSet_LoadingBtn(true);

    let model = {
      usuarioId: idUsuario,
      horarios: Object.keys(horario).map(dia => ({
        dia: dia,
        inicio: horario[dia].inicio,
        fin: horario[dia].fin,
        esDiaLibre: horario[dia].es_dia_libre
      }))
    }

    try {
      const response = await fetch(`/api/usuarios/horarios`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });

      const data = await response.json();
      if (data.status == "success") {
        toast.success(data.message)
        onGet_ListaUsuarios();
        onSet_LoadingBtn(false);
        onClose();
      }
      else {
        onSet_LoadingBtn(false);
        toast.error(data.message)
      }
    }
    catch (error) {
      onSet_LoadingBtn(false);
      console.error('Error al editar el horario:', error);
      toast.error("Error al editar el horario: " + error)
    }
  };

  const resetForm = () => {
    if (!open) {
      setHorario(initialHorario);
      setErrors({});
      onSet_LoadingBtn(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (open) {
      onGet_HorariosByUsuario();
    }
  }, [open, onGet_HorariosByUsuario]);




  if (!open) return null;

  const modalChild = (

    <>
      {
        loading ? (
          <div className="flex items-center justify-center mt-20">
            <ClipLoader size={30} speedMultiplier={1.5} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="shadow-xl border-2 bg-white dark:bg-gray-700 px-1 py-1 rounded-xl mt-4">
              <div className="relative overflow-x-auto shadow-md rounded-lg" style={{ overflow: 'auto', maxHeight: '18rem' }}>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-white uppercase bg-gray-900 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3" style={{ width: '10%' }}>Día</th>
                      <th className="px-6 py-3" style={{ width: '10%' }}>Hora Inicio</th>
                      <th className="px-6 py-3" style={{ width: '10%' }}>Hora Fin</th>
                      <th className="px-6 py-3" style={{ width: '10%' }}>Es Día Libre</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.keys(horario).map((dia) => (
                      <tr key={dia} className="text-center">
                        <td className="px-4 py-2 capitalize">{dia}</td>
                        <td className="px-4 py-2">
                          <HtmlFormInput
                            type={"time"}
                            id={"iptDiaInicio_" + dia}
                            value={horario[dia].inicio}
                            disabled={horario[dia].es_dia_libre}
                            onChange={(e) => handleChange(dia, "inicio", e.target.value)}
                            additionalClass={errors[`${dia}_inicio`] || errors[`${dia}_horario`] ? 'is-invalid' : ''}
                          />
                          {errors[`${dia}_inicio`] && <span className="text-red-500 text-sm">{errors[`${dia}_inicio`]}</span>}
                          {errors[`${dia}_horario`] && <span className="text-red-500 text-sm">{errors[`${dia}_horario`]}</span>}
                        </td>
                        <td className="px-4 py-2">
                          <HtmlFormInput
                            type={"time"}
                            id={"iptDiaFin_" + dia}
                            value={horario[dia].fin}
                            disabled={horario[dia].es_dia_libre}
                            onChange={(e) => handleChange(dia, "fin", e.target.value)}
                            additionalClass={errors[`${dia}_fin`] || errors[`${dia}_horario`] ? 'is-invalid' : ''}
                          />
                          {errors[`${dia}_fin`] && <span className="text-red-500 text-sm">{errors[`${dia}_fin`]}</span>}
                        </td>
                        <td className="px-4 py-2">
                          <HtmlCheckButton
                            checked={horario[dia].es_dia_libre}
                            onChange={() => handleDiaLibreChange(dia)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-full p-2 border-t border-gray-300">
              {
                loadingBtn ? (
                  <div className="flex items-center justify-center mt-20">
                    <ClipLoader size={30} speedMultiplier={1.5} />
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <HtmlButton type="submit" legend={"Editar"} color={"green"} icon={Pencil} />
                    <HtmlButton type="button" legend={"Cancelar"} color={"red"} icon={X} onClick={handleCancel} />
                  </div>
                )
              }
            </div>
          </form>

        )
      }


    </>
  );

  return (
    <ModalTemplate open={open} onClose={onClose} icon={Pencil} title={"Editar Horario"}>
      <>
        {
          loading ? (
            <div className="flex items-center justify-center mt-20">
              <ClipLoader size={30} speedMultiplier={1.5} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="shadow-xl border-2 bg-white dark:bg-gray-700 px-1 py-1 rounded-xl mt-4">
                <div className="relative overflow-x-auto shadow-md rounded-lg" style={{ overflow: 'auto', maxHeight: '18rem' }}>
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-white uppercase bg-gray-900 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-6 py-3" style={{ width: '10%' }}>Día</th>
                        <th className="px-6 py-3" style={{ width: '10%' }}>Hora Inicio</th>
                        <th className="px-6 py-3" style={{ width: '10%' }}>Hora Fin</th>
                        <th className="px-6 py-3" style={{ width: '10%' }}>Es Día Libre</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.keys(horario).map((dia) => (
                        <tr key={dia} className="text-center">
                          <td className="px-4 py-2 capitalize">{dia}</td>
                          <td className="px-4 py-2">
                            <HtmlFormInput
                              type={"time"}
                              id={"iptDiaInicio_" + dia}
                              value={horario[dia].inicio}
                              disabled={horario[dia].es_dia_libre}
                              onChange={(e) => handleChange(dia, "inicio", e.target.value)}
                              additionalClass={errors[`${dia}_inicio`] || errors[`${dia}_horario`] ? 'is-invalid' : ''}
                            />
                            {errors[`${dia}_inicio`] && <span className="text-red-500 text-sm">{errors[`${dia}_inicio`]}</span>}
                            {errors[`${dia}_horario`] && <span className="text-red-500 text-sm">{errors[`${dia}_horario`]}</span>}
                          </td>
                          <td className="px-4 py-2">
                            <HtmlFormInput
                              type={"time"}
                              id={"iptDiaFin_" + dia}
                              value={horario[dia].fin}
                              disabled={horario[dia].es_dia_libre}
                              onChange={(e) => handleChange(dia, "fin", e.target.value)}
                              additionalClass={errors[`${dia}_fin`] || errors[`${dia}_horario`] ? 'is-invalid' : ''}
                            />
                            {errors[`${dia}_fin`] && <span className="text-red-500 text-sm">{errors[`${dia}_fin`]}</span>}
                          </td>
                          <td className="px-4 py-2">
                            <HtmlCheckButton
                              checked={horario[dia].es_dia_libre}
                              onChange={() => handleDiaLibreChange(dia)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-full p-2 border-t border-gray-300">
                {
                  loadingBtn ? (
                    <div className="flex items-center justify-center mt-20">
                      <ClipLoader size={30} speedMultiplier={1.5} />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center gap-4 mt-4">
                      <HtmlButton type="submit" legend={"Editar"} color={"green"} icon={Pencil} />
                      <HtmlButton type="button" legend={"Cancelar"} color={"red"} icon={X} onClick={handleCancel} />
                    </div>
                  )
                }
              </div>
            </form>

          )
        }


      </>
    </ModalTemplate>
  )

}
