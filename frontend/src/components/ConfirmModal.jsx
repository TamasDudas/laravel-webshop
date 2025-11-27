import React from 'react';

export default function ConfirmModal({ onConfirm, onCancel, message }) {
	return (
		<div className="border-red-500 border-2 max-w-2xs rounded-2xl m-auto py-3 flex flex-col gap-4 my-6">
			<p className="text-center text-slate-200">{message}</p>
			<div className="flex justify-center gap-x-3">
				<button className="py-2 px-4  bg-gray-800 text-white cursor-pointer rounded-xl" onClick={onCancel}>
					Mégse
				</button>
				<button className="py-2 px-4  bg-red-800 text-white cursor-pointer  rounded-xl" onClick={onConfirm}>
					Törlés
				</button>
			</div>
		</div>
	);
}
