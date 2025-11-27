import React, { useState } from 'react';
import { useCategories } from '../../contexts/CategoriesContext';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';

export default function Categories() {
	const { categories, handleDeleteCategory } = useCategories();
	const [showModal, setShowModal] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState(null);

	const deleteCategory = async () => {
		if (categoryToDelete) {
			const result = await handleDeleteCategory(categoryToDelete.id);
			if (result.success) {
				alert('Kategória sikeresen törölve!');
			} else {
				alert(result.error);
			}
			setShowModal(false);
			setCategoryToDelete(null);
		}
	};

	const openDeleteModal = (category) => {
		setCategoryToDelete(category);
		setShowModal(true);
	};

	return (
		<div className="container mx-auto p-4">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-slate-300">Kategóriák kezelése</h1>
					<Link
						to="/create-category"
						className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
					>
						Új kategória
					</Link>
				</div>
				{showModal && (
					<ConfirmModal
						onConfirm={deleteCategory}
						onCancel={() => setShowModal(false)}
						message={`Biztos törölni akarod a "${categoryToDelete?.name}" kategóriát?`}
					/>
				)}
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					{categories.length === 0 ? (
						<div className="p-8 text-center text-gray-500">
							<p>Még nincsenek kategóriák létrehozva.</p>
							<Link to="/create-category" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
								Hozd létre az elsőt!
							</Link>
						</div>
					) : (
						<div className="divide-y divide-gray-200">
							{categories.map((category) => (
								<div key={category.id} className="p-6 flex justify-between items-center">
									<div>
										<h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
									</div>
									<div className="flex gap-2">
										<Link
											to={`/update-category/${category.id}`}
											className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
										>
											Szerkesztés
										</Link>
										<button
											onClick={() => openDeleteModal(category)}
											className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
										>
											Törlés
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
