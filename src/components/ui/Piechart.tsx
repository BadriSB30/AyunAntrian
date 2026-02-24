'use client';

import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	type ChartOptions,
	type TooltipItem,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { BarChartProps } from '@/types/barchart';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ data, className = '' }: BarChartProps) {
	const chartData = {
		labels: data.map((d) => d.label),
		datasets: [
			{
				label: 'Jumlah Antrian',
				data: data.map((d) => d.value),
				backgroundColor: data.map((d) => d.color ?? 'rgba(16, 185, 129, 0.8)'),
				borderColor: '#ffffff',
				borderWidth: 2,
			},
		],
	};

	const options: ChartOptions<'pie'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					usePointStyle: true,
					padding: 20,
				},
			},
			tooltip: {
				callbacks: {
					label: (ctx: TooltipItem<'pie'>) => ` ${ctx.label}: ${ctx.parsed} antrian`,
				},
			},
		},
	};

	return (
		<div className={`relative h-64 w-full ${className}`}>
			<Pie
				data={chartData}
				options={options}
			/>
		</div>
	);
}
