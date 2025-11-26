import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const ProductsContext = createContext({
	products: [],
	loading: false,
	error: null,
	currentPage: 1,
	lastPage: 1,
	perPage: 8,
	totalPage: 0,
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

	//Lapozás
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [totalPage, setTotal] = useState(0);
	const [perPage, setPerPage] = useState(8);

	async function fetchProduct(page = currentPage) {
		try {
			setLoading(true);
			const fetchData = await api.get(`/products?page=${page}`);
			const response = fetchData.data; // A teljes válasz, nem csak data.data
			setProduct(response.data); // Termékek tömbje
			setCurrentPage(response.current_page);
			setLastPage(response.last_page);
			setTotal(response.total);
			setLoading(false);
		} catch (error) {
			setError(error.response?.data?.message || 'Nem sikerült betölteni a termékeket');
		} finally {
			setLoading(false);
		}
	}

	return (
		<ProductsContext.Provider
			value={{
				products,
				loading,
				error,
				currentPage,
				lastPage,
				totalPage,
				perPage,
				fetchProduct,
				setCurrentPage,
			}}
		>
			{children}
		</ProductsContext.Provider>
	);
}
