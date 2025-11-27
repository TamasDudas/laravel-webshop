import React, { useEffect } from 'react';
import CategoryForm from '../../components/forms/CategoryForm';
import { useParams } from 'react-router-dom';
import { useCategories } from '../../contexts/CategoriesContext';

export default function UpdateCategory() {
	const { id } = useParams();
	const { category, fetchCategory } = useCategories();

	useEffect(() => {
		if (id) {
			fetchCategory(id);
		}
	}, [id, fetchCategory]);

	if (!category) {
		return <p>Betöltés...</p>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Kategória szerkesztése</h1>
				<CategoryForm categoryId={id} initialCategory={category} />
			</div>
		</div>
	);
}
