import { createContext, useContext, useState } from 'react';
import api from '../api';

const ProductContext = createContext({
	product: null,
	loading: false,
	error: null,
	fetchProduct: async () => {},
	handleCreateProduct: async () => {},
});

export function useProduct() {
	const context = useContext(ProductContext);
	if (!context) {
		throw Error('Nincs ilyen context');
	}
	return context;
}

export default function ProductProvider({ children }) {
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchProduct = async (id) => {
		try {
			setLoading(true);
			setError(null);

			const responseData = await api.get(`/products/${id}`);
			const response = responseData.data.data; // Egy termék esetén nested data

			setProduct(response);
		} catch (error) {
			setError(error.response?.data?.message || 'Nem sikerült betölteni a terméket');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateProduct = async (productData) => {
		try {
			setLoading(true);
			setError(null); // Reset error
			const response = await api.post('/products', productData);
			const newProduct = response.data;
			setProduct(newProduct);
			return { success: true, data: newProduct };
		} catch (error) {
			const errorMessage = error.response?.data?.error || 'Nem sikerült a termék létrehozása';
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setLoading(false);
		}
	};

	return (
		<ProductContext.Provider value={{ product, loading, error, fetchProduct, handleCreateProduct }}>
			{children}
		</ProductContext.Provider>
	);
}
