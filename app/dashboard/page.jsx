'use client';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import HtmlBreadCrumb from '../components/HtmlHelpers/BreadCrumb';
import TopCards from '../components/reporteria/TopCards';
import BarChart from '../components/reporteria/BarChart';
import BarChartProductos from '../components/reporteria/BarChartProductos';
const itemsBreadCrumb = ["Home", "Dashboard"];

export default function DashboardPage() {
    const { data: session, status } = useSession();
    return (
        <>
            <div className="w-full p-4">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="pl-2 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <HtmlBreadCrumb items={itemsBreadCrumb} />
                    </ol>
                </nav>
            </div>

            <div className="w-full px-4">
                <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
                    <div className="mx-auto max-w-screen-2xl">
                        <div>
                            {/* Tarjetas superiores */}
                            <div className="mb-8">
                                <TopCards />
                            </div>

                            {/* Gráficos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="w-full h-full overflow-hidden">
                                    <BarChart className="w-full h-full object-contain" />
                                </div>
                                <div className="w-full h-full overflow-hidden">
                                    <BarChartProductos className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}
