import React from 'react';

export default function ProductForm() {
	return (
		<form className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Kategória</label>
				<select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
					<option value="">Válassz kategóriát</option>
					{/* Kategóriák opciói */}
				</select>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Termék neve</label>
				<input
					type="text"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="pl. Elegáns karóra"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Leírás</label>
				<textarea
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					rows="4"
					placeholder="Részletes leírás a termékről"
				></textarea>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Ár (Ft)</label>
				<input
					type="number"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					min="0"
					placeholder="0"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Készlet</label>
				<input
					type="number"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					min="0"
					placeholder="0"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Képek</label>
				<input
					type="file"
					multiple
					accept="image/*"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="flex items-center">
				<input
					type="checkbox"
					className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
				/>
				<label className="ml-2 block text-sm text-gray-900">Aktív</label>
			</div>

			<button
				type="submit"
				className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
			>
				Termék létrehozása
			</button>
		</form>
	);
}
