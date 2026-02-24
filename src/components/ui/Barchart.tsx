'use client';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	Legend,
	type ChartOptions,
	type TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { BarChartProps } from '@/types/barchart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function BarChart({ data, className = '' }: BarChartProps) {
	const chartData = {
		labels: data.map((d) => d.label),
		datasets: [
			{
				label: 'Jumlah Antrian',
				data: data.map((d) => d.value),
				backgroundColor: data.map((d) => d.color ?? 'rgba(16, 185, 129, 0.8)'),
				borderRadius: 8,
				maxBarThickness: 60,
			},
		],
	};

	const options: ChartOptions<'bar'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: (ctx: TooltipItem<'bar'>) => ` ${ctx.parsed.y} antrian`,
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					precision: 0,
				},
				grid: {
					color: '#e5e7eb',
				},
			},
			x: {
				grid: {
					display: false,
				},
			},
		},
	};

	return (
		<div className={`relative h-64 w-full ${className}`}>
			<Bar
				data={chartData}
				options={options}
			/>
		</div>
	);
}
