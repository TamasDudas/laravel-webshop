import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export default function Cart() {
	const navigate = useNavigate();
	const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

	if (cartItems.length === 0) {
		return (
			<div>
				<h2 className="text-slate-200 font-bold">Kosár</h2>
				<p className="text-slate-200">A kosár üres</p>
			</div>
		);
	}
	return (
		<div>
			<div>
				<table>
					<thead>
						<tr>
							<th className="text-slate-200">Név</th>
							<th className="text-slate-200">Ár</th>
							<th className="text-slate-200">Mennyiség</th>
							<th className="text-slate-200">Műveletek</th>
						</tr>
					</thead>
					<tbody>
						{cartItems.map((cartItem, index) => (
							<tr key={index}>
								<td className="text-slate-300">{cartItem.product.name}</td>
								<td className="text-slate-300">{cartItem.product.price}</td>
								<td className="text-slate-300">{cartItem.quantity}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
