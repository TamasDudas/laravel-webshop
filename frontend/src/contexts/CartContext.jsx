import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext({
	cartItems: [],
	addTocart: () => {},
	fetchCartItems: () => {},
	removeFromCart: () => {},
	updateQuantity: () => {},
	getTotalItems: () => {},
	getTotalPrice: () => {},
	clearCart: () => {},
});

export const useCart = () => {
	const context = useContext(CartContext);

	if (!context) {
		throw Error('Nincs ilyen context');
	}

	return context;
};

export default function CartProvider({ children }) {
	const { user } = useAuth();
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchCartItems = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await api.get('/cart-items');
			setCartItems(response.data.data || []);
		} catch (error) {
			setError(error.response?.data?.message || 'Nem sikerült betölteni a kosarat');
			setCartItems([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			fetchCartItems();
		} else {
			setCartItems([]);
		}
	}, [user]);

	const addToCart = async (cartData) => {
		try {
			setLoading(true);
			setError(null);
			const response = await api.post('/cart-items', cartData);
			const newCartItem = response.data.data;

			setCartItems((prevItems) => {
				const existingIndex = prevItems.findIndex((item) => item.product?.id === newCartItem.product?.id);

				if (existingIndex >= 0) {
					// Frissítjük a mennyiséget
					const updatedItems = [...prevItems];
					updatedItems[existingIndex] = newCartItem;
					return updatedItems;
				} else {
					// Hozzáadjuk az új elemet
					const newItems = [...prevItems, newCartItem];
					return newItems;
				}
			});
			return { success: true };
		} catch (error) {
			setError(error.response?.data?.message || 'Nem sikerült a terméket a kosárba helyezni');
			return { success: false, error: error.response?.data?.message || 'Hiba történt' };
		} finally {
			setLoading(false);
		}
	};

	function getTotalItems() {
		const total = cartItems.reduce((sum, item) => {
			return sum + item.quantity;
		}, 0);

		return total;
	}

	const removeFromCart = async (product_id) => {};
	const updateQuantity = async () => {};
	const getTotalPrice = async () => {};
	const clearCart = async () => {};

	return (
		<CartContext.Provider
			value={{
				addToCart,
				cartItems,
				fetchCartItems,
				removeFromCart,
				updateQuantity,
				getTotalItems,
				getTotalPrice,
				clearCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}
