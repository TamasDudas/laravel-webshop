import React, { useEffect } from 'react';
import ProductForm from '../../components/forms/ProductForm';
import { useParams } from 'react-router-dom';
import { useProduct } from '../../contexts/ProductContext';

export default function UpdateProduct() {
	const { id } = useParams();
	const { product, fetchProduct } = useProduct();

	useEffect(() => {
		if (id) {
			fetchProduct(id);
		}
	}, [id, fetchProduct]);

	if (!product) {
		return <p>Betöltés...</p>;
	}

	return <ProductForm productId={id} initialProduct={product} />;
}
