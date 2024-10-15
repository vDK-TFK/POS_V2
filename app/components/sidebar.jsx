"use client"
import * as icon from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { createContext, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const SidebarContext = createContext();

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSmallScreen(true);
        setExpanded(false);
      } else {
        setIsSmallScreen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (status === "unauthenticated") return <div>No autorizado</div>;

  const permisos = session?.user?.rol.permisos || [];

  const iconMap = {
    'Dashboard': <icon.Gauge size={20} />,
    'Info. Caja': <icon.Computer size={20} />,
    'POS': <icon.Utensils size={20} />,
    'Facturas': <icon.ScrollText size={20} />,
    'Inventario': <icon.Warehouse size={20} />,
    'Proveedores': <icon.Truck size={20} />,
    'Categorías': <icon.BadgeCent size={20} />,
    'Reportes': <icon.FileLineChart size={20} />,
    'Empleados': <icon.BriefcaseBusiness size={20} />,
    'Metas': <icon.Goal size={20} />,
    'Adm. Clientes': <icon.BookUser size={20} />,
    'Seguridad': <icon.LockKeyhole size={20} />,
    'Pedidos': <icon.Truck size={20} />,
    'Horarios': <icon.AlarmClock size={20} />,
    'Entrada / Salida': <icon.Flag size={20} />,
  };

  const sidebarItems = permisos
  .filter(permiso => permiso.jerarquia === 1) 
  .map(permiso => {
    const subItems = permisos
      .filter(subPermiso => 
        subPermiso.jerarquia === 2 && subPermiso.idPermisoPadre === permiso.idPermiso 
      )
      .map(subPermiso => ({
        text: subPermiso.nombre,
        link: subPermiso.url,
      }));

    return {
      icon: iconMap[permiso.nombre] || <icon.MoreVertical size={20} />,
      text: permiso.nombre,
      link: permiso.url,
      subItems: subItems.length > 0 ? subItems : null,
    };
  });

  return (
    <>
      <aside className={`h-screen ${isSmallScreen && expanded ? "fixed" : "static"} inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out`}>
        <nav className="h-full flex flex-col bg-white dark:bg-gray-800 border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center bg-custom-yellow">
            <Image src="/nombre.png" width={200} height={200} alt="Nombre de la empresa" className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} />

            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg bg-custom-yellow hover:bg-yellow-600"
            >
              {expanded ? <icon.ChevronFirst /> : <icon.ChevronLast />}
            </button>
          </div>

          <ul className="flex-1 px-3 overflow-y-auto">
            {status === "loading" ? (
              <div className="flex items-center justify-center mt-20">
                <ClipLoader size={30} speedMultiplier={1.5} />
              </div>
            ) : (
              sidebarItems.map((item, index) => (
                <SidebarItem key={index} expanded={expanded} {...item} />
              ))
            )}
          </ul>

          <div className="border-t border-gray-400 dark:border-gray-200 flex p-3">
            <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
              <div className="leading-4 text-gray-700 dark:text-white">
                {/* <h4 className="font-semibold">Grupo03</h4> */}
                <span className="text-xs text-gray-600">Desarrollado por: Grupo 03</span>
              </div>
              <div className="flex flex-row space-x-2">
                <a href="/api/auth/signout" title="Cerrar Sesión"  className="inline-flex items-center p-2 text-sm font-medium text-gray-500 rounded-lg dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <icon.LogOutIcon size={16} />
                </a>
              </div>
            </div>
          </div>
        </nav>
      </aside>
      {expanded && isSmallScreen && <div className="fixed inset-0 bg-black opacity-50 z-40"></div>}
    </>
  );
}

export function SidebarItem({ icon, text, link, expanded, subItems }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownClick = () => setDropdownOpen(!dropdownOpen);

  const itemClassName = `flex items-center p-2 w-full text-base font-medium rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`;
  
  if (subItems && subItems.length > 0) {
    return (
      <li className={`relative my-1 ${!expanded ? 'hidden' : ''}`}>
        <button
          type="button"
          className={itemClassName}
          aria-expanded={dropdownOpen ? "true" : "false"}
          onClick={handleDropdownClick}
        >
          <span className="flex items-center justify-center">{icon}</span>
          <span className="flex-1 ml-3 text-left whitespace-nowrap">{text}</span>
          {subItems && (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          )}
        </button>
        <ul className={`py-2 space-y-2 ${dropdownOpen ? "block" : "hidden"}`}>
          {subItems.map((item, index) => (
            <li key={index}>
              <Link href={item.link} className="flex items-center p-2 pl-11 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className={`relative flex items-center my-1 py-2 px-3 font-medium rounded-md cursor-pointer transition-colors group`}>
      <Link className="flex items-center" href={link}>
        <span className="flex items-center justify-center">{icon}</span>
        <span className={`overflow-hidden transition-all ${expanded ? "ml-3" : "w-0"}`}>{text}</span>
      </Link>
    </li>
  );
}
