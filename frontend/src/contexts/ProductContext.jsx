import { createContext, useContext, useState, useCallback } from 'react';
import { productService } from '../services/crudService';

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

const ProductContext = createContext({
	product: null,
	loading: false,
	error: null,
	fetchProduct: async () => {},
	handleCreateProduct: async () => {},
	handleUpdateProduct: async () => {},
	handleDeleteProduct: async () => {},
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

	const fetchProduct = useCallback(async (id) => {
		try {
			setLoading(true);
			setError(null);
			const product = await productService.fetchOne(id);
			setProduct(product);
		} catch (error) {
			setError(error.response?.data?.message || 'Nem sikerült betölteni a terméket');
		} finally {
			setLoading(false);
		}
	}, []);

	const handleCreateProduct = useCallback(async (productData) => {
		try {
			setLoading(true);
			setError(null);
			const newProduct = await productService.create(productData);
			setProduct(newProduct);
			return { success: true, data: newProduct };
		} catch (error) {
			const errorMessage = extractErrorMessage(error);
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setLoading(false);
		}
	}, []);

	const handleUpdateProduct = useCallback(async (id, productData) => {
		try {
			setLoading(true);
			setError(null);
			const updatedProduct = await productService.update(id, productData);
			setProduct(updatedProduct);
			return { success: true, data: updatedProduct };
		} catch (error) {
			const errorMessage = extractErrorMessage(error);
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setLoading(false);
		}
	}, []);

	const handleDeleteProduct = useCallback(async (id) => {
		try {
			setLoading(true);
			setError(null);
			await productService.delete(id);
			setProduct(null); // Sikeres törlés után ürítjük a state-et
			return { success: true };
		} catch (error) {
			const errorMessage = extractErrorMessage(error);
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setLoading(false);
		}
	}, []);
	return (
		<ProductContext.Provider
			value={{
				product,
				loading,
				error,
				fetchProduct,
				handleCreateProduct,
				handleUpdateProduct,
				handleDeleteProduct,
			}}
		>
			{children}
		</ProductContext.Provider>
	);
}
