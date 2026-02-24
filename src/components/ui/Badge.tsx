// src/components/ui/badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
	'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
	{
		variants: {
			variant: {
				default: 'bg-gray-100 text-gray-800',
				primary: 'bg-blue-100 text-blue-700',
				success: 'bg-emerald-100 text-emerald-700',
				warning: 'bg-yellow-100 text-yellow-800',
				danger: 'bg-red-100 text-red-700',
				info: 'bg-sky-100 text-sky-700',
				outline: 'border border-gray-300 text-gray-700 bg-transparent',
			},
			size: {
				sm: 'text-xs px-2 py-0.5',
				md: 'text-sm px-2.5 py-0.5',
				lg: 'text-sm px-3 py-1',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	},
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
	return (
		<span
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	);
}
