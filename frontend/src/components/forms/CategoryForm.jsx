import React, { useState, useEffect } from 'react';
import { useCategories } from '../../contexts/CategoriesContext';

export default function CategoryForm({ categoryId, initialCategory }) {
	const { handleCreateCategory, handleUpdateCategory, loading } = useCategories();

	// Form adatok state-je
	const [formData, setFormData] = useState({
		name: '',
	});

	// Jelzi, hogy a form betöltődött-e már (hogy ne írja felül a módosításokat)
	const [formLoaded, setFormLoaded] = useState(false);

	// Ha update mód és initialCategory van, töltse be a form-ot
	useEffect(() => {
		if (initialCategory && !formLoaded) {
			setFormData({
				name: initialCategory.name || '',
			});
			setFormLoaded(true);
		}
	}, [initialCategory, formLoaded]);

	// Form mezők változásainak kezelése
	const handleData = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Form beküldésének kezelése
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (categoryId) {
			// Update
			const result = await handleUpdateCategory(categoryId, formData);
			if (result.success) {
				alert('Kategória sikeresen frissítve!');
			} else {
				alert(result.error);
			}
		} else {
			// Create
			const result = await handleCreateCategory(formData);
			if (result.success) {
				alert('Kategória sikeresen létrehozva!');
				// Form resetelése
				setFormData({
					name: '',
				});
			} else {
				alert(result.error);
			}
		}
	};

	return (
		<form
			className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
			onSubmit={handleSubmit}
		>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Kategória neve</label>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleData}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="pl. Karórák"
					required
				/>
			</div>

			<button
				type="submit"
				className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 min-h-[42px]"
				disabled={loading}
			>
				{loading ? 'Feldolgozás...' : categoryId ? 'Kategória frissítése' : 'Kategória létrehozása'}
			</button>
		</form>
	);
}
