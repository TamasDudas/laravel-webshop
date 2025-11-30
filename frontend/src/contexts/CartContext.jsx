import { createContext, useContext, useState } from 'react';
import api from '../api';

const CartContext = createContext({
	cartItems: [],
	addTocart: () => {},
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
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const addToCart = async (cartData) => {
		try {
			setLoading(true);
			setError(null);
			const response = await api.post('/cart-items', cartData);
			const newCartItem = response.data;
			setCartItems((prevItems) => {
				const existingIndex = prevItems.findIndex((item) => item.product_id === newCartItem.product_id);
				if (existingIndex >= 0) {
					// Frissítjük a mennyiséget
					const updatedItems = [...prevItems];
					updatedItems[existingIndex] = newCartItem;
					return updatedItems;
				} else {
					// Hozzáadjuk az új elemet
					return [...prevItems, newCartItem];
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

	const removeFromCart = async (product_id) => {};
	const updateQuantity = async () => {};
	const getTotalItems = async () => {};
	const getTotalPrice = async () => {};
	const clearCart = async () => {};

	return (
		<CartContext.Provider
			value={{
				addToCart,
				cartItems,
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
