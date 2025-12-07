import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export default function Cart() {
	const navigate = useNavigate();
	const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen bg-gray-900 py-12 px-4">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-3xl font-bold text-slate-200 mb-8">Kosár</h2>
					<div className="bg-gray-800 rounded-lg p-8 text-center">
						<div className="text-6xl mb-4">🛒</div>
						<p className="text-slate-300 text-lg mb-6">A kosár üres</p>
						<button
							onClick={() => navigate('/')}
							className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
						>
							Vásárlás folytatása
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 py-12 px-4">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold text-slate-200 mb-8">Kosár</h2>

				{/* Kosár elemek */}
				<div className="space-y-4 mb-8">
					{cartItems.map((cartItem, index) => (
						<div key={cartItem.id || index} className="bg-gray-800 rounded-lg p-6 shadow-lg">
							<div className="flex items-center space-x-6">
								{/* Termék kép */}
								<div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
									{cartItem.product?.images?.length > 0 ? (
										<img
											src={`http://localhost:8000/storage/${cartItem.product.images[0].image_path}`}
											alt={cartItem.product.name}
											className="w-full h-full object-cover rounded-lg"
										/>
									) : (
										<div className="text-2xl">📦</div>
									)}
								</div>

								{/* Termék adatok */}
								<div className="flex-1">
									<h3 className="text-xl font-semibold text-slate-200 mb-2">{cartItem.product.name}</h3>

									<p className="text-green-400 font-medium">{cartItem.product.price} Ft / db</p>
								</div>

								{/* Mennyiség vezérlők */}
								<div className="flex items-center space-x-3">
									<button
										onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity - 1)}
										className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-slate-200 rounded-full flex items-center justify-center transition-colors"
									>
										−
									</button>
									<span className="text-slate-200 font-medium min-w-8 text-center">{cartItem.quantity}</span>
									<button
										onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity + 1)}
										className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-slate-200 rounded-full flex items-center justify-center transition-colors"
									>
										+
									</button>
								</div>

								{/* Ár */}
								<div className="text-right">
									<p className="text-xl font-bold text-slate-200">{cartItem.product.price * cartItem.quantity} Ft</p>
									<p className="text-slate-400 text-sm">
										({cartItem.quantity} × {cartItem.product.price} Ft)
									</p>
								</div>

								{/* Törlés gomb */}
								<button
									onClick={() => removeFromCart(cartItem.product.id)}
									className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
									title="Eltávolítás a kosárból"
								>
									×
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Összesítő */}
				<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
					<div className="flex justify-between items-center mb-6">
						<div>
							<p className="text-slate-400">Termékek száma:</p>
							<p className="text-2xl font-bold text-slate-200">{getTotalItems()} db</p>
						</div>
						<div className="text-right">
							<p className="text-slate-400">Teljes összeg:</p>
							<p className="text-3xl font-bold text-green-400">{getTotalPrice()} Ft</p>
						</div>
					</div>

					{/* Akció gombok */}
					<div className="flex space-x-4">
						<button
							onClick={() => navigate('/products')}
							className="flex-1 bg-gray-700 hover:bg-gray-600 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
						>
							Vásárlás folytatása
						</button>
						<button
							onClick={() => navigate('/order')}
							className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
						>
							Pénztár
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
