import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChartProductos = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [chartOptions, setChartOptions] = useState({});
    const [periodo, setPeriodo] = useState('diario');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/reportes/productos/${periodo}`);
                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }
                const data = await res.json();

                if (data.ventasProductos) {
                    // Extrae los periodos y productos
                    const labels = [...new Set(data.ventasProductos.map(item => item.periodo))];
                    const productos = [...new Set(data.ventasProductos.map(item => item.producto))];

                    // Construye los datasets para cada producto
                    const datasets = productos.map(producto => {
                        return {
                            label: producto,
                            data: labels.map(label => {
                                const venta = data.ventasProductos.find(item => item.periodo === label && item.producto === producto);
                                return venta ? venta.total_ventas : 0;
                            }),
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 1
                        };
                    });

                    setChartData({
                        labels: labels,
                        datasets: datasets,
                    });

                    setChartOptions({
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: `Ventas de productos (${periodo.toUpperCase()})`
                            }
                        },
                        maintainAspectRatio: false,
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Periodo'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Ventas Totales'
                                },
                                beginAtZero: true
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error al obtener datos de productos:', error);
            }
        };

        fetchData();
    }, [periodo]);

    return (
        <div className='w-full md:col-span-12 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
            <div className="flex justify-center space-x-4 mb-4">
                <button className={`py-2 px-4 rounded ${periodo === 'diario' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setPeriodo('diario')}>Diario</button>
                <button className={`py-2 px-4 rounded ${periodo === 'semanal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setPeriodo('semanal')}>Semanal</button>
                <button className={`py-2 px-4 rounded ${periodo === 'mensual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setPeriodo('mensual')}>Mensual</button>
                <button className={`py-2 px-4 rounded ${periodo === 'anual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setPeriodo('anual')}>Anual</button>
            </div>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default BarChartProductos;
