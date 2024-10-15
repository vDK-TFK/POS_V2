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
import { ClipLoader } from 'react-spinners';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = () => {
    const [chartData, setChartData] = useState({
        datasets: [],
    });
    const [chartOptions, setChartOptions] = useState({});
    const [selectedTab, setSelectedTab] = useState('diario');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/reportes/${selectedTab}`);
                const data = await res.json();

                if (data.ventas) {
                    const labels = data.ventas.map(item => {
                        switch (selectedTab) {
                            case 'diario':
                                return item.dia;
                            case 'semanal':
                                return `Semana ${item.semana}`;
                            case 'mensual':
                                return `Mes ${item.mes}`;
                            case 'anual':
                                return `Año ${item.año}`;
                            default:
                                return '';
                        }
                    });
                    const ventasData = data.ventas.map(item => item.total_ventas);

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Ventas ₡',
                                data: ventasData,
                                borderColor: 'rgb(53, 162, 235)',
                                backgroundColor: 'rgba(53, 162, 235, 0.4)',
                            },
                        ]
                    });

                    setChartOptions({
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: `Ventas ${selectedTab}`
                            }
                        },
                        maintainAspectRatio: false,
                        responsive: true
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Error al obtener datos de ventas');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedTab]);

    return (
        <div className="w-full md:col-span-12 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
            <div className="flex justify-center space-x-4 mb-4">
                <button
                    className={`py-2 px-4 rounded ${selectedTab === 'diario' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedTab('diario')}
                >
                    Diario
                </button>
                <button
                    className={`py-2 px-4 rounded ${selectedTab === 'semanal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedTab('semanal')}
                >
                    Semanal
                </button>
                <button
                    className={`py-2 px-4 rounded ${selectedTab === 'mensual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedTab('mensual')}
                >
                    Mensual
                </button>
                <button
                    className={`py-2 px-4 rounded ${selectedTab === 'anual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedTab('anual')}
                >
                    Anual
                </button>
            </div>
            {loading && <p><ClipLoader size={30} speedMultiplier={1.5} /></p>}
            {error && <p>{error}</p>}
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default BarChart;
