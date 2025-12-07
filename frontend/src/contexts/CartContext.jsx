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
			// Vendég felhasználó esetében localStorage-ból töltjük
			const savedCart = localStorage.getItem('cartItems');
			if (savedCart) {
				try {
					setCartItems(JSON.parse(savedCart));
				} catch (error) {
					console.error('Hiba a kosár betöltésekor:', error);
					setCartItems([]);
				}
			}
		}
	}, [user]);

	const addToCart = async (cartData) => {
		try {
			setLoading(true);
			setError(null);

			if (user) {
				// Bejelentkezett felhasználó esetében backend
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
			} else {
				// Vendég felhasználó esetében localStorage
				setCartItems((prevItems) => {
					const existingIndex = prevItems.findIndex((item) => item.product?.id === cartData.product_id);

					if (existingIndex >= 0) {
						// Frissítjük a mennyiséget
						const updatedItems = [...prevItems];
						updatedItems[existingIndex] = {
							...updatedItems[existingIndex],
							quantity: updatedItems[existingIndex].quantity + cartData.quantity,
						};
						localStorage.setItem('cartItems', JSON.stringify(updatedItems));
						return updatedItems;
					} else {
						// Hozzáadjuk az új elemet
						const newItem = {
							id: Date.now(), // Ideiglenes ID
							product_id: cartData.product_id,
							quantity: cartData.quantity,
							product: cartData.product, // Teljes termék adat
						};
						const newItems = [...prevItems, newItem];
						localStorage.setItem('cartItems', JSON.stringify(newItems));
						return newItems;
					}
				});
			}

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

	//Ár
	function getTotalPrice() {
		const total = cartItems.reduce((sum, item) => {
			const price = item.product?.price || 0;
			const quantity = item.quantity || 0;
			return sum + price * quantity;
		}, 0);

		return total;
	}

	//Tölés a kosárból
	const removeFromCart = async (product_id) => {
		if (user) {
			// Bejelentkezett felhasználó esetében backend
			try {
				setLoading(true);
				setError(null);

				// Megkeressük a cart item id-t
				const cartItem = cartItems.find((item) => item.product.id === product_id);
				if (!cartItem) return;

				await api.delete(`/cart-items/${cartItem.id}`);

				setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItem.id));
			} catch (error) {
				setError(error.response?.data?.message || 'Nem sikerült törölni a terméket');
			} finally {
				setLoading(false);
			}
		} else {
			// Vendég felhasználó esetében localStorage
			setCartItems((prevItems) => {
				const newCartItems = prevItems.filter((cartItem) => cartItem.product.id !== product_id);
				localStorage.setItem('cartItems', JSON.stringify(newCartItems));
				return newCartItems;
			});
		}
	};

	//Termék mennyiség update
	const updateQuantity = async (product_id, newQuantity) => {
		if (newQuantity <= 0) {
			return removeFromCart(product_id);
		}

		if (user) {
			// Bejelentkezett felhasználó esetében backend
			try {
				setLoading(true);
				setError(null);

				// Megkeressük a cart item id-t
				const cartItem = cartItems.find((item) => item.product.id === product_id);
				if (!cartItem) return;

				const response = await api.put(`/cart-items/${cartItem.id}`, {
					quantity: newQuantity,
				});

				const updatedItem = response.data.data;

				setCartItems((prevItems) =>
					prevItems.map((item) => (item.id === cartItem.id ? updatedItem : item))
				);
			} catch (error) {
				setError(error.response?.data?.message || 'Nem sikerült frissíteni a mennyiséget');
			} finally {
				setLoading(false);
			}
		} else {
			// Vendég felhasználó esetében localStorage
			setCartItems((prevItems) => {
				const updatedCartItems = prevItems.map((cartItem) => {
					if (cartItem.product.id === product_id) {
						return { ...cartItem, quantity: newQuantity };
					}
					return cartItem;
				});
				localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
				return updatedCartItems;
			});
		}
	};

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
