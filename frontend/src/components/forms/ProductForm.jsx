import React, { useState } from 'react';
import { useCategories } from '../../contexts/CategoriesContext';

import { useImageHandler } from '../../hooks/useImageHandler'; // Képkezelő hook importálása

export default function ProductForm() {
	const { categories } = useCategories();

	// Képkezelés külön hook-kal
	const { images, addImages, removeImage, clearImages, appendImagesToFormData } = useImageHandler();

	// Form adatok state-je (képek nélkül, azok a hook-ban vannak)
	const [formData, setFormData] = useState({
		category_id: '',
		name: '',
		description: '',
		price: 0,
		stock: 0,
		is_active: true,
	});

	// Form mezők változásainak kezelése
	const handleData = (e) => {
		const { name, value, type, checked, files } = e.target;
		if (type === 'file' && files) {
			// Képek hozzáadása a hook-on keresztül
			addImages(files);
			e.target.value = ''; // Mező kiürítése
		} else {
			// Egyéb mezők kezelése
			setFormData((prev) => ({
				...prev,
				[name]: type === 'checkbox' ? checked : value,
			}));
		}
	};

	// Form beküldésének kezelése
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formDataToSend = new FormData(); // FormData létrehozása
		formDataToSend.append('category_id', formData.category_id);
		formDataToSend.append('name', formData.name);
		formDataToSend.append('description', formData.description);
		formDataToSend.append('price', formData.price);
		formDataToSend.append('stock', formData.stock);
		formDataToSend.append('is_active', formData.is_active ? '1' : '0');
		// Képek hozzáadása a hook-on keresztül
		appendImagesToFormData(formDataToSend);
		const result = await handleCreateProduct(formDataToSend);
		if (result.success) {
			alert('Termék sikeresen létrehozva!');
			// Form és képek resetelése
			setFormData({
				category_id: '',
				name: '',
				description: '',
				price: 0,
				stock: 0,
				is_active: true,
			});
			clearImages();
		} else {
			alert(result.error);
		}
	};

	return (
		<form
			className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
			onSubmit={handleSubmit}
		>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Kategória</label>
				<select
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					name="category_id"
					value={formData.category_id}
					onChange={handleData}
				>
					<option value="">Válassz kategóriát</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Termék neve</label>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleData}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="pl. Elegáns karóra"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Leírás</label>
				<textarea
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					rows="4"
					name="description"
					value={formData.description}
					onChange={handleData}
					placeholder="Részletes leírás a termékről"
				></textarea>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Ár (Ft)</label>
				<input
					type="number"
					name="price"
					value={formData.price}
					onChange={handleData}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					min="0"
					placeholder="0"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Készlet</label>
				<input
					type="number"
					name="stock"
					value={formData.stock}
					onChange={handleData}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					min="0"
					placeholder="0"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Képek</label>
				<input
					type="file"
					multiple // Több fájl kiválasztásának engedélyezése
					accept="image/*" // Csak képfájlok elfogadása
					name="images"
					onChange={handleData}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{/* Kiválasztott képek előnézete, csak ha van kiválasztott kép */}
				{images.length > 0 && (
					<div className="mt-4">
						<h4 className="text-sm font-medium text-gray-700 mb-2">Kiválasztott képek:</h4>
						<div className="grid grid-cols-3 gap-4">
							{' '}
							{/* 3 oszlopos rács */}
							{images.map((image, index) => (
								<div key={index} className="relative">
									{/* Kép előnézet: URL.createObjectURL-al blob URL létrehozása a File objektumból */}
									<img
										src={URL.createObjectURL(image)}
										alt={image.name}
										className="w-full h-30 object-cover rounded border"
									/>
									{/* Törlés gomb minden képhez */}
									<button
										type="button"
										onClick={() => removeImage(index)}
										className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-stretch-100% hover:bg-red-600"
									>
										×
									</button>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="flex items-center">
				<input
					type="checkbox"
					name="is_active"
					checked={formData.is_active}
					onChange={handleData}
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
