export function StatusToggle({
	checked,
	onChange,
	disabled,
}: {
	checked: boolean;
	onChange: (value: boolean) => void;
	disabled?: boolean;
}) {
	return (
		<button
			type='button'
			disabled={disabled}
			onClick={() => onChange(!checked)}
			className={`relative inline-flex h-6 w-11 items-center rounded-full transition
				${checked ? 'bg-blue-600' : 'bg-gray-300'}
				${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
		>
			<span
				className={`inline-block h-4 w-4 transform rounded-full bg-white transition
					${checked ? 'translate-x-6' : 'translate-x-1'}`}
			/>
		</button>
	);
}
