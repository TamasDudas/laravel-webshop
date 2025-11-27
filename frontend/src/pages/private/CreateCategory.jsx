import React from 'react';
import CategoryForm from '../../components/forms/CategoryForm';

export default function CreateCategory() {
	return (
		<div className="container mx-auto p-4">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold text-slate-300 mb-8 text-center">Új kategória létrehozása</h1>
				<CategoryForm />
			</div>
		</div>
	);
}
