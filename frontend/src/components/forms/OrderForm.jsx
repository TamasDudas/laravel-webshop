import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

export default function OrderForm() {
	const { user } = useAuth();
	const { cartItems, getTotalPrice, clearCart } = useCart();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		guest_name: '',
		guest_email: '',
		guest_phone: '',
		shipping_address: '',
		billing_address: '',
		shipping_method_id: '',
	});

	const [shippingMethods, setShippingMethods] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Shipping methods betöltése
	useEffect(() => {
		const fetchShippingMethods = async () => {
			try {
				const response = await api.get('/shipping-methods');
				setShippingMethods(response.data.data || []);
			} catch (error) {
				console.error('Nem sikerült betölteni a szállítási módokat:', error);
			}
		};
		fetchShippingMethods();
	}, []);

	// Ha bejelentkezett felhasználó, töltse be az adatait
	useEffect(() => {
		if (user) {
			setFormData((prev) => ({
				...prev,
				guest_name: user.name || '',
				guest_email: user.email || '',
			}));
		}
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Order adatok előkészítése
			const orderData = {
				user_id: user?.id || null,
				shipping_method_id: parseInt(formData.shipping_method_id),
				status: 'pending',
				total_amount: getTotalPrice(),
				guest_email: formData.guest_email,
				guest_name: formData.guest_name,
				guest_phone: formData.guest_phone,
				shipping_address: formData.shipping_address,
				billing_address: formData.billing_address,
				items: cartItems.map((item) => ({
					product_id: item.product.id,
					quantity: item.quantity,
					price: item.product.price,
				})),
			};

			await api.post('/orders', orderData);

			// Kosár ürítése
			await clearCart();

			// Átirányítás a siker oldalra vagy rendelés részleteihez
			navigate('/');
		} catch (error) {
			setError(error.response?.data?.message || 'Hiba történt a rendelés leadásakor');
		} finally {
			setLoading(false);
		}
	};

	const totalPrice = getTotalPrice();

	return (
		<div className="min-h-screen bg-gray-900 py-12 px-4">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold text-slate-200 mb-8">Rendelés leadása</h2>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Bal oldal: Űrlap */}
					<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
						{error && (
							<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Név */}
							<div>
								<label htmlFor="guest_name" className="block text-sm font-medium text-slate-300 mb-1">
									Név *
								</label>
								<input
									type="text"
									id="guest_name"
									name="guest_name"
									value={formData.guest_name}
									onChange={handleChange}
									required
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>

							{/* Email */}
							<div>
								<label htmlFor="guest_email" className="block text-sm font-medium text-slate-300 mb-1">
									Email *
								</label>
								<input
									type="email"
									id="guest_email"
									name="guest_email"
									value={formData.guest_email}
									onChange={handleChange}
									required
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>

							{/* Telefonszám */}
							<div>
								<label htmlFor="guest_phone" className="block text-sm font-medium text-slate-300 mb-1">
									Telefonszám
								</label>
								<input
									type="tel"
									id="guest_phone"
									name="guest_phone"
									value={formData.guest_phone}
									onChange={handleChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>

							{/* Szállítási cím */}
							<div>
								<label htmlFor="shipping_address" className="block text-sm font-medium text-slate-300 mb-1">
									Szállítási cím *
								</label>
								<textarea
									id="shipping_address"
									name="shipping_address"
									value={formData.shipping_address}
									onChange={handleChange}
									required
									rows="3"
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Irányítószám, város, utca, házszám"
								/>
							</div>

							{/* Számlázási cím */}
							<div>
								<label htmlFor="billing_address" className="block text-sm font-medium text-slate-300 mb-1">
									Számlázási cím *
								</label>
								<textarea
									id="billing_address"
									name="billing_address"
									value={formData.billing_address}
									onChange={handleChange}
									required
									rows="3"
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Irányítószám, város, utca, házszám"
								/>
							</div>

							{/* Szállítási mód */}
							<div>
								<label htmlFor="shipping_method_id" className="block text-sm font-medium text-slate-300 mb-1">
									Szállítási mód *
								</label>
								<select
									id="shipping_method_id"
									name="shipping_method_id"
									value={formData.shipping_method_id}
									onChange={handleChange}
									required
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									<option value="">Válassz szállítási módot</option>
									{shippingMethods.map((method) => (
										<option key={method.id} value={method.id}>
											{method.name} - {method.price} Ft ({method.estimated_days} nap)
										</option>
									))}
								</select>
							</div>

							{/* Submit gomb */}
							<button
								type="submit"
								disabled={loading || cartItems.length === 0}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? 'Rendelés feldolgozása...' : 'Rendelés leadása'}
							</button>
						</form>
					</div>

					{/* Jobb oldal: Rendelés összesítő */}
					<div className="space-y-6">
						{/* Kosár tartalom */}
						<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
							<h3 className="text-xl font-semibold text-slate-200 mb-4">Kosár tartalma</h3>
							<div className="space-y-3">
								{cartItems.map((item) => (
									<div key={item.product.id} className="flex justify-between items-center">
										<div className="flex-1">
											<p className="text-slate-200 font-medium">{item.product.name}</p>
											<p className="text-slate-400 text-sm">
												{item.quantity} × {item.product.price} Ft
											</p>
										</div>
										<p className="text-green-400 font-medium">{item.product.price * item.quantity} Ft</p>
									</div>
								))}
							</div>
						</div>

						{/* Összesítő */}
						<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
							<h3 className="text-xl font-semibold text-slate-200 mb-4">Rendelés összesítő</h3>

							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-slate-400">Termékek:</span>
									<span className="text-slate-200">{totalPrice} Ft</span>
								</div>

								{formData.shipping_method_id && (
									<div className="flex justify-between">
										<span className="text-slate-400">Szállítás:</span>
										<span className="text-slate-200">
											{shippingMethods.find((m) => m.id == formData.shipping_method_id)?.price || 0} Ft
										</span>
									</div>
								)}

								<div className="border-t border-gray-700 pt-3">
									<div className="flex justify-between text-lg font-bold">
										<span className="text-slate-200">Összesen:</span>
										<span className="text-green-400">
											{parseFloat(totalPrice) +
												parseFloat(shippingMethods.find((m) => m.id == formData.shipping_method_id)?.price || 0)}{' '}
											Ft
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
