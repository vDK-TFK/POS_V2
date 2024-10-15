'use client'

import { GetValueById } from "@/app/api/utils/js-helpers";
import HtmlBreadCrumb from "@/app/components/HtmlHelpers/BreadCrumb";
import HtmlButton from "@/app/components/HtmlHelpers/Button";
import HtmlFormInput from "@/app/components/HtmlHelpers/FormInput";
import { ArrowLeftCircle, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from 'sonner';
import Image from "next/image";

const itemsBreadCrumb = ["Home", "Info Empresa"];

export default function InfoEmpresa() {
   const [loading, setLoading] = useState(true);
   const [imagePreview, setImagePreview] = useState(null);
   const [imageType, setImageType] = useState(null);
   const [actualizaImagen, onSet_ActualizarImagen] = useState(false);
   const [esActualizar, onSet_EsActualizar] = useState(false);
   const onReady = useRef(false);




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
         if (!response.ok) {
            throw new Error(`Error al obtener la información de la empresa: ${response.statusText}`);
         }
         const result = await response.json();

         if (result.status == "success") {
            toast.success('Se ha obtenido la información');
            onSet_Empresa(result.data);
            const bufferImagen = Buffer.from(result.data.logo);
            const imgBase64 = bufferImagen.toString('base64');
            const imgSrc = `data:${result.data.tipoImagen};base64,${imgBase64}`;

            setImagePreview(imgSrc);
            onSet_EsActualizar(true);
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
      //  else if(esActualizar){
      //    onUpdate_InfoEmpresa();
      //  }
      //  else{
      //    onSave_InfoEmpresa();
      //  }

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

      try {
         const response = await fetch('/api/empresa', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
         });

         const result = await response.json();
         console.log("Response: " + response + "  ---- " + "Result: " + result);

         if (result.status == "success") {
            toast.success('Información actualizada satisfactoriamente');
         }
         else {
            console.log("Error al actualizar la información: " + result.message);
            toast.error('Error al actualizar la información');
         }


      }
      catch (error) {
         toast.error("Sucedió un error al actualizar la información", error);
         console.error(error);
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

   if (loading) {
      return (
         <div className="w-full h-screen flex items-center justify-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full" role="status">
               <span className="visually-hidden"></span>
            </div>
         </div>
      );
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
               <h4 className="text-2xl font-bold dark:text-white">Información de la empresa</h4>
            </div>
            <hr />
            <form method="POST" onSubmit={onSubmit_Form}>
               <div className="grid gap-4 mt-4 mb-4 grid-cols-12">
                  <HtmlFormInput id={"txtNombre"} name="nombre" additionalClass={"ipt-empresa"} value={empresa.nombre} legend={"Nombre"} colSize={4} onChange={eventoForm} />
                  <HtmlFormInput id={"txtNombreComercial"} name="nombreComercial" additionalClass={"ipt-empresa"} value={empresa.nombreComercial} legend={"Nombre Comercial"} colSize={4} onChange={eventoForm} />
                  <HtmlFormInput id={"txtIdentificacion"} name="identificacion" additionalClass={"ipt-empresa"} value={empresa.identificacion} legend={"Identificación"} colSize={4} onChange={eventoForm} />
               </div>

               <div className="grid gap-4 mt-4 mb-4 grid-cols-12">
                  <HtmlFormInput id={"txtCorreo"} name="correo" additionalClass={"ipt-empresa"} value={empresa.correo} legend={"Correo"} colSize={3} onChange={eventoForm} />
                  <HtmlFormInput id={"txtTelefono"} name="telefono" additionalClass={"ipt-empresa"} value={empresa.telefono} legend={"Teléfono"} colSize={2} onChange={eventoForm} />
                  <HtmlFormInput id={"txtCelular"} name="celular" additionalClass={"ipt-empresa"} value={empresa.celular} legend={"Celular"} colSize={2} onChange={eventoForm} />
                  <HtmlFormInput id={"txtDireccion"} name="direccion" additionalClass={"ipt-empresa"} value={empresa.direccion} legend={"Dirección"} colSize={5} onChange={eventoForm} />
               </div>
            </form>
            <hr />
            <div className="grid gap-4 mt-4 mb-4 grid-cols-12">
               <HtmlFormInput type={"file"} legend={"Logotipo"} colSize={6} onChange={onCharge_Imagen} />
               <div className="col-span-3 mt-10">
                  {!esActualizar && (
                     <HtmlButton type="submit" color={"green"} legend={"Guardar Información"} onClick={() => { onSave_InfoEmpresa() }} icon={Check} />
                  )}
                  {esActualizar && (
                     <HtmlButton type="submit" color={"blue"} legend={"Actualizar Información"} onClick={() => { onUpdate_InfoEmpresa() }} icon={ArrowLeftCircle} />
                  )}
               </div>
            </div>
            {imagePreview && (
               <div className="grid gap-4 mt-2 mb-4 grid-cols-12">
                  <div className="col-span-2">
                     <div className="mt-2 border-2 flex flex-col">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Vista Previa:</h3>
                        <div>
                           <Image src={imagePreview} alt="Preview" className="max-w-40 max-h-40" width={200} height={200} />
                        </div>
                     </div>
                  </div>
               </div>
            )}


         </div>
         <Toaster richColors />
      </>
   );
}
