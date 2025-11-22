import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const CategoriesContext = createContext({
	categories: [],
	loading: false,
	error: null,
	fetchCategories: async () => {},
});

export const useCategories = () => {
	const context = useContext(CategoriesContext);
	if (!context) {
		throw Error('Nincs ilyen context');
	}
	return context;
};

export default function CategoriesProvider({ children }) {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await api.get('/categories');
			setCategories(response.data.data || response.data);
		} catch (error) {
			setError('Az API hívás sikertelen');
		} finally {
			setLoading(false);
		}
	};

	return (
		<CategoriesContext.Provider value={{ categories, loading, error, fetchCategories }}>
			{children}
		</CategoriesContext.Provider>
	);
}
