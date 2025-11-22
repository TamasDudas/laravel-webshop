import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const ProductsContext = createContext({
	products: [],
	loading: false,
	error: null,
	fetchProduct: async () => {},
});

export const useProducts = () => {
	const context = useContext(ProductsContext);

	if (!context) {
		throw Error('Nem létezik ilyen context');
	}

	return context;
};

export default function ProductsProvider({ children }) {
	const [products, setProduct] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchProduct();
	}, []);

	async function fetchProduct() {
		try {
			setLoading(true);
			const fetchData = await api.get('/products');
			setProduct(fetchData.data.data);
		} catch (error) {
			console.error('Hiba a termékek lekérdezésekor:', error);
			setError(error.response?.data?.message || 'Nem sikerült betölteni a termékeket');
		} finally {
			setLoading(false);
		}
	}

	return (
		<ProductsContext.Provider value={{ products, loading, error, fetchProduct }}>
			{children}
		</ProductsContext.Provider>
	);
}
