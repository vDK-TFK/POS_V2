"use client"
import { useState } from 'react';

const Aside = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    return (
        <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <li>
                        <a href="/Home/Index" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <i className="fa-solid fa-home"></i>
                            <span className="ms-3">Inicio</span>
                        </a>
                    </li>

                    <li>
                        <button
                            type="button"
                            onClick={toggleDropdown}
                            className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                            aria-controls="dropdown-Pagos"
                            aria-expanded={isDropdownOpen}
                        >
                            <i className="fa-solid fa-coins"></i>
                            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Pagos</span>
                            <i className={`fa-sharp fa-solid fa-chevron-down ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                        </button>
                        <ul id="dropdown-Pagos" className={`py-2 space-y-2 ${isDropdownOpen ? '' : 'hidden'}`}>
                            <li>
                                <a
                                    href="/Pagos/Index"
                                    className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-8 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                >
                                    <i className="far fa-circle mr-3"></i>Admin. Pagos
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Aside;
