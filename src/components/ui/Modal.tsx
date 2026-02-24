'use client';

import { createContext, useContext, useEffect, type ReactNode, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalContextValue {
	onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
	const ctx = useContext(ModalContext);
	if (!ctx) {
		throw new Error('Modal components must be used inside <Modal />');
	}
	return ctx;
}

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	size?: ModalSize;
	children: ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-2xl',
};

export function Modal({ isOpen, onClose, size = 'md', children }: ModalProps) {
	// Escape key handler
	useEffect(() => {
		if (!isOpen) return;

		const onEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		document.addEventListener('keydown', onEsc);
		return () => document.removeEventListener('keydown', onEsc);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<ModalContext.Provider value={{ onClose }}>
			<AnimatePresence>
				<motion.div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
					onClick={handleBackdropClick}
					role='dialog'
					aria-modal='true'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ type: 'spring', stiffness: 300, damping: 25 }}
						className={`w-full rounded-2xl bg-white p-6 shadow-xl ${sizeClasses[size]}`}
					>
						{children}
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</ModalContext.Provider>
	);
}

/* =========================
   COMPOUND COMPONENTS
========================= */

interface HeaderProps {
	title: string;
}

Modal.Header = function ModalHeader({ title }: HeaderProps) {
	const { onClose } = useModalContext();

	return (
		<div className='mb-4 flex items-center justify-between'>
			<h2 className='text-lg font-semibold'>{title}</h2>
			<button
				type='button'
				onClick={onClose}
				aria-label='Close modal'
				className='text-gray-500 hover:text-gray-700'
			>
				✕
			</button>
		</div>
	);
};

interface BodyProps {
	children: ReactNode;
}

Modal.Body = function ModalBody({ children }: BodyProps) {
	return <div className='mb-6'>{children}</div>;
};

interface FooterProps {
	onSubmit?: () => void;
	submitText?: string;
}

Modal.Footer = function ModalFooter({ onSubmit, submitText = 'Submit' }: FooterProps) {
	const { onClose } = useModalContext();

	return (
		<div className='flex justify-end gap-3'>
			<button
				type='button'
				onClick={onClose}
				className='rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300'
			>
				Cancel
			</button>

			{onSubmit && (
				<button
					type='button'
					onClick={onSubmit}
					className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
				>
					{submitText}
				</button>
			)}
		</div>
	);
};

/**const [open, setOpen] = useState(false);

<Modal isOpen={open} onClose={() => setOpen(false)} size="lg">
	<Modal.Header title="Edit Data Loket" />

	<Modal.Body>
		<FormEditCounter />
	</Modal.Body>

	<Modal.Footer
		onSubmit={handleSubmit}
		submitText="Simpan"
	/>
</Modal>;
 **/
