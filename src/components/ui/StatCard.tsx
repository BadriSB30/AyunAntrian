import { Badge } from '@/components/ui/Badge';

type StatCardProps = {
	label: string;
	value: number;
	badge?: {
		text: string;
		variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
	};
};

export function StatCard({ label, value, badge }: StatCardProps) {
	return (
		<div className='rounded-xl bg-white p-4 shadow-sm border space-y-2'>
			<div className='flex items-center justify-between'>
				<p className='text-sm text-gray-500'>{label}</p>

				{badge && (
					<Badge
						variant={badge.variant}
						size='sm'
					>
						{badge.text}
					</Badge>
				)}
			</div>

			<p className='text-2xl font-bold text-gray-800'>{value}</p>
		</div>
	);
}
