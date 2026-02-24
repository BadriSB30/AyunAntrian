// src/types/barchart.ts
export type BarChartItem = {
	label: string;
	value: number;
	color?: string;
};

export type BarChartProps = {
	data: BarChartItem[];
	className?: string;
};
