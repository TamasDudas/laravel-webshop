import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { categoryService } from '../services/crudService';

// Hibakezelés kiemelése (DRY principle)
function extractErrorMessage(error) {
	if (!error.response) return 'Hálózati hiba történt';

	if (error.response.status === 401) return 'Bejelentkezés szükséges';

	if (error.response.data?.error) return error.response.data.error;
	if (error.response.data?.message) return error.response.data.message;

	if (error.response.data?.errors) {
		const errors = Object.values(error.response.data.errors).flat();
		return errors.join(', ');
	}

	return 'Nem sikerült a művelet';
}

const CategoriesContext = createContext({
	categories: [],
	category: null,
	loading: false,
	error: null,
	fetchCategories: async () => {},
	fetchCategory: async () => {},
	handleCreateCategory: async () => {},
	handleUpdateCategory: async () => {},
	handleDeleteCategory: async () => {},
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
	const [category, setCategory] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const categories = await categoryService.fetchAll();
			setCategories(categories);
		} catch (error) {
			setError('Az API hívás sikertelen');
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchCategory = useCallback(async (id) => {
		try {
			setLoading(true);
			setError(null);
			const category = await categoryService.fetchOne(id);
			setCategory(category);
		} catch (error) {
			setError(error.response?.data?.message || 'Nem sikerült betölteni a kategóriát');
		} finally {
			setLoading(false);
		}
	}, []);

	const handleCreateCategory = useCallback(
		async (categoryData) => {
			try {
				setLoading(true);
				setError(null);
				const newCategory = await categoryService.create(categoryData);
				// Frissítsük a teljes listát az API-ból, hogy biztosan konzisztens legyen
				await fetchCategories();
				return { success: true, data: newCategory };
			} catch (error) {
				const errorMessage = extractErrorMessage(error);
				setError(errorMessage);
				return { success: false, error: errorMessage };
			} finally {
				setLoading(false);
			}
		},
		[fetchCategories]
	);

	const handleUpdateCategory = useCallback(
		async (id, categoryData) => {
			try {
				setLoading(true);
				setError(null);
				await categoryService.update(id, categoryData);
				// Frissítsük a teljes listát az API-ból, hogy biztosan konzisztens legyen
				await fetchCategories();
				return { success: true };
			} catch (error) {
				const errorMessage = extractErrorMessage(error);
				setError(errorMessage);
				return { success: false, error: errorMessage };
			} finally {
				setLoading(false);
			}
		},
		[fetchCategories]
	);

	const handleDeleteCategory = useCallback(
		async (id) => {
			try {
				setLoading(true);
				setError(null);
				await categoryService.delete(id);
				// Frissítsük a teljes listát az API-ból, hogy biztosan konzisztens legyen
				await fetchCategories();
				return { success: true };
			} catch (error) {
				const errorMessage = extractErrorMessage(error);
				setError(errorMessage);
				return { success: false, error: errorMessage };
			} finally {
				setLoading(false);
			}
		},
		[fetchCategories]
	);

	return (
		<CategoriesContext.Provider
			value={{
				categories,
				category,
				loading,
				error,
				fetchCategories,
				fetchCategory,
				handleCreateCategory,
				handleUpdateCategory,
				handleDeleteCategory,
			}}
		>
			{children}
		</CategoriesContext.Provider>
	);
}
