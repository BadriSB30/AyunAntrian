import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ total, ruangan }) => {
  const data = {
    labels: ['Total Antrian', 'Jumlah Ruangan'],
    datasets: [
      {
        label: 'Jumlah',
        data: [total, ruangan],
        backgroundColor: ['#3182CE', '#63B3ED'],
        borderColor: '#1A202C',
        borderWidth: 1,
        categoryPercentage: 0.5,
        barPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { ticks: { maxRotation: 45, minRotation: 0 } },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-4 mx-auto
      w-[300px] h-[220px]
      sm:w-[400px] sm:h-[260px]
      md:w-[500px] md:h-[300px]
      lg:w-[600px] lg:h-[350px]
      xl:w-[1000px] xl:h-[400px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
