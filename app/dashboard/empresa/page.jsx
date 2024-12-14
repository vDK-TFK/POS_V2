'use client'

import { GetValueById } from "@/app/api/utils/js-helpers";
import HtmlBreadCrumb from "@/app/components/HtmlHelpers/BreadCrumb";
import HtmlButton from "@/app/components/HtmlHelpers/Button";
import HtmlFormInput from "@/app/components/HtmlHelpers/FormInput";
import { ArrowLeftCircle, Check, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from 'sonner';
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import PageContent from "@/app/components/HtmlHelpers/PageContent";

const itemsBreadCrumb = ["Home", "Info Empresa"];

export default function InfoEmpresa() {
   const [loading, setLoading] = useState(true);
   const [imagePreview, setImagePreview] = useState(null);
   const [imageType, setImageType] = useState(null);
   const [actualizaImagen, onSet_ActualizarImagen] = useState(false);
   const [esActualizar, onSet_EsActualizar] = useState(false);
   const onReady = useRef(false);
   const [onLoadingBtn,onSetLoadingBtn] = useState(false);

   //#region [OBTENER INFO]
   const [empresa, onSet_Empresa] = useState({
      nombre: '',
      nombreComercial: '',
      identificacion: '',
      correo: '',
      telefono: '',
      celular: '',
      direccion: ''
   });

   const onGet_InfoEmpresa = async () => {
      try {
         const response = await fetch(`/api/empresa`);
         const result = await response.json();

         if (result.status == "success") {
            toast.success('Se ha obtenido la información');
            onSet_Empresa(result.data);

            if (result.data.logo) {
               const bufferImagen = Buffer.from(result.data.logo);
               const imgBase64 = bufferImagen.toString('base64');
               const imgSrc = `data:${result.data.tipoImagen};base64,${imgBase64}`;

               setImagePreview(imgSrc);
            }

            if (result.data) {
               onSet_EsActualizar(true);

            }
         }
         else if (result.code == 204) {
            toast.warning('No se encontró la información de la empresa debe agregarla');
            onSet_EsActualizar(false);
         }
         else {
            toast.error('Sucedió un error al obtener la información');
            onSet_EsActualizar(false);
         }
      }
      catch (error) {
         console.error('Error:', error);
         console.log("Error al obtener la info de la empresa: " + error);
         toast.error('Sucedió un error al obtener la información');
      }
      finally {
         setLoading(false);
      }
   };

   const eventoForm = (e) => {
      const { name, value } = e.target;
      onSet_Empresa(prevState => ({
         ...prevState,
         [name]: value
      }));
   };

   //#endregion

   //#region [GUARDAR INFO]

   const onSubmit_Form = (e) => {
      e.preventDefault();
      var isValid = true;

      const elements = document.getElementsByClassName("ipt-empresa");

      Array.from(elements).forEach((item) => {
         if (item.value.trim() == "") {
            item.classList.add('is-invalid');
            item.classList.remove('is-valid');
            isValid = false;
         }
         else {
            item.classList.add('is-valid');
            item.classList.remove('is-invalid');
         }
      });

      if (!isValid) {
         toast.warning('Aún existen campos por completar');
      }
       else if(esActualizar){
         onUpdate_InfoEmpresa();
       }
       else{
         onSave_InfoEmpresa();
       }

   }

   async function onUpdate_InfoEmpresa() {
      var bytesImage;
      var typeImage;

      if (imagePreview && imageType) {
         if (imageType === 'image/png') {
            bytesImage = imagePreview.replace(/^data:image\/png;base64,/, '');
         } else if (imageType === 'image/jpeg') {
            bytesImage = imagePreview.replace(/^data:image\/jpeg;base64,/, '');
         }
         typeImage = imageType;
      }

      let model = {
         idEmpresa: empresa.idEmpresa,
         nombre: GetValueById("txtNombre"),
         nombreComercial: GetValueById("txtNombreComercial"),
         identificacion: GetValueById("txtIdentificacion"),
         correo: GetValueById("txtCorreo"),
         telefono: GetValueById("txtTelefono"),
         celular: GetValueById("txtCelular"),
         direccion: GetValueById("txtDireccion"),
         logo: bytesImage,
         tipoImagen: typeImage,
         actualizaImagen: actualizaImagen
      };

      onSetLoadingBtn(true)

      try {
         const response = await fetch('/api/empresa', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
         });

         const result = await response.json();

         if (result.status == "success") {
            toast.success('Información actualizada satisfactoriamente');
            onSetLoadingBtn(false)
            onGet_InfoEmpresa()

         }
         else {
            console.log("Error al actualizar la información: " + result.message);
            toast.error('Error al actualizar la información');
         }


      }
      catch (error) {
         toast.error("Sucedió un error al actualizar la información", error);
         console.error("Sucedió un error al actualizar la información", error);
      }

   }

   async function onSave_InfoEmpresa() {
      var bytesImage;
      var typeImage;

      if (imagePreview && imageType) {
         if (imageType === 'image/png') {
            bytesImage = imagePreview.replace(/^data:image\/png;base64,/, '');
         } else if (imageType === 'image/jpeg') {
            bytesImage = imagePreview.replace(/^data:image\/jpeg;base64,/, '');
         }
         typeImage = imageType;
      }

      let model = {
         nombre: GetValueById("txtNombre"),
         nombreComercial: GetValueById("txtNombreComercial"),
         identificacion: GetValueById("txtIdentificacion"),
         correo: GetValueById("txtCorreo"),
         telefono: GetValueById("txtTelefono"),
         celular: GetValueById("txtCelular"),
         direccion: GetValueById("txtDireccion"),
         logo: bytesImage,
         tipoImagen: typeImage
      };
      onSetLoadingBtn(true)

      try {
         const response = await fetch('/api/empresa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
         });

         if (response.ok) {
            const result = await response.json();

            if (result.status == "success") {
               toast.success('Información registrada satisfactoriamente');
               onSetLoadingBtn(false)
               onGet_InfoEmpresa()

            }
            else {
               console.log("Error al registrar la información: " + result.message);
               toast.error('Error al registrar la información');
            }

         }
         else {
            toast.error('Error al registrar la información');
         }
      }
      catch (error) {
         toast.error("Sucedió un error registrar la información");
         console.log("Error al registrar la información: " + error);
      }

   }
   //#endregion

   //#region [PROCESAR IMAGEN]
   const onCharge_Imagen = (e) => {
      const file = e.target.files[0];

      if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
         const reader = new FileReader();

         reader.onloadend = () => {
            toast.success("Imagen cargada exitosamente");
            setImagePreview(reader.result);
            setImageType(file.type);

            if (empresa) {
               onSet_ActualizarImagen(true);
            }

         };

         reader.readAsDataURL(file);
      }
      else {
         toast.error("El formato debe ser PNG O JPG")
         console.error('El archivo seleccionado no es una imagen JPG o PNG.');
         setImagePreview(null);
      }
   };

   //#endregion

   useEffect(() => {
      if (!onReady.current) {
         onGet_InfoEmpresa();
      }
      onReady.current = true;

   }, []);

  
   const pageContent = (

      loading
         ? (
            <div className="flex items-center justify-center mt-20">
               <ClipLoader size={30} speedMultiplier={1.5} />
            </div>
         )
         :
         (
            <>
               <form method="POST" onSubmit={onSubmit_Form}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
                     <HtmlFormInput id={"txtNombre"} name="nombre" additionalClass={"ipt-empresa"} value={empresa.nombre} legend={"Nombre"} colSize={1} onChange={eventoForm} />
                     <HtmlFormInput id={"txtNombreComercial"} name="nombreComercial" additionalClass={"ipt-empresa"} value={empresa.nombreComercial} legend={"Nombre Comercial"} colSize={1} onChange={eventoForm} />
                     <HtmlFormInput id={"txtIdentificacion"} name="identificacion" additionalClass={"ipt-empresa"} value={empresa.identificacion} legend={"Identificación"} colSize={1} onChange={eventoForm} />
                  </div >

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
                     <HtmlFormInput id={"txtCorreo"} name="correo" additionalClass={"ipt-empresa"} value={empresa.correo} legend={"Correo"} colSize={1} onChange={eventoForm} />
                     <HtmlFormInput id={"txtTelefono"} name="telefono" additionalClass={"ipt-empresa"} value={empresa.telefono} legend={"Teléfono"} colSize={1} onChange={eventoForm} />
                     <HtmlFormInput id={"txtCelular"} name="celular" additionalClass={"ipt-empresa"} value={empresa.celular} legend={"Celular"} colSize={1} onChange={eventoForm} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
                     <HtmlFormInput id={"txtDireccion"} name="direccion" additionalClass={"ipt-empresa"} value={empresa.direccion} legend={"Dirección"} colSize={1} onChange={eventoForm} />
                  </div>
               </form >

               <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
                  <HtmlFormInput type={"file"} legend={"Logotipo"} colSize={1} onChange={onCharge_Imagen} />

               </div>


               <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
               {
                  onLoadingBtn ? (
                     <ClipLoader size={30} speedMultiplier={1.5} />
                  ) : (
                     <>
                        {!esActualizar && (
                           <HtmlButton type="submit" color={"green"} legend={"Guardar Información"} onClick={() => { onSave_InfoEmpresa() }} icon={Check} />
                        )}
                        {esActualizar && (
                           <HtmlButton type="submit" color={"blue"} legend={"Actualizar Información"} onClick={() => { onUpdate_InfoEmpresa() }} icon={Pencil} />
                        )}
                     </>
                  )
               }
                  
               </div>

               {
                  imagePreview && (
                     <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
                        <div className="col-span-1">
                           <div className="mt-2 border-2 inline-block">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Vista Previa:</h3>
                              <Image
                                 src={imagePreview}
                                 alt="Preview"
                                 className="block"
                                 width={200}
                                 height={200}
                              />
                           </div>
                        </div>
                     </div>
                  )
               }


            </>

         )


   );

   return (
      <PageContent content={pageContent} itemsBreadCrumb={itemsBreadCrumb} tituloCard="Información de la empresa"  />
   );
}
