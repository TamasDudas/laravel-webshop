import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../../contexts/ProductContext';
import { Img } from 'react-image';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';
import { useCart } from '../../contexts/CartContext';

export default function Product() {
	const { id } = useParams();
	const { product, loading, fetchProduct, error, handleDeleteProduct } = useProduct();
	const [showModal, setShowModal] = useState(false);
	const hasFetched = useRef(false);
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [quantity, setQuantity] = useState(1);
	const { addToCart } = useCart();

	useEffect(() => {
		// Csak akkor töltjük be, ha nincs termék vagy más termék van, és még nem töltöttük be
		if ((!product || product.id !== parseInt(id)) && !hasFetched.current) {
			hasFetched.current = true;
			fetchProduct(id);
		}

		// Reset amikor id változik
		return () => {
			hasFetched.current = false;
		};
	}, [id]);

	if (loading) {
		return <p>Betöltés...</p>;
	}

	if (error) {
		return <p>Hiba: {error}</p>;
	}

	if (!product) {
		return <p>Nincs termék</p>;
	}
	const handleAddToCart = async () => {
		const result = await addToCart({
			product_id: product.id,
			quantity: parseInt(quantity),
			product: product,
		});
		if (result.success) {
			alert('Sikeresen hozzáadva a kosárhoz!');
		} else {
			alert(result.error);
		}
	};

	//TERMÉK TÖRLÉSE
	const deleteProduct = async () => {
		const result = await handleDeleteProduct(id);
		if (result.success) {
			navigate('/');
		} else {
			alert(result.error);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<div className="bg-gray-800 rounded-xl p-6 shadow-2xl max-w-4xl mx-auto">
				<div className="flex flex-col md:flex-row gap-6">
					{/* Bal oldal: Kép */}
					<div className="md:w-1/2">
						{product.images && product.images.length > 0 && (
							<Img
								src={`http://localhost:8000/storage/${
									product.images.find((img) => img.is_primary)?.image_path || product.images[0].image_path
								}`}
								alt={product.name}
								className="w-full h-96 object-cover rounded-lg border border-white"
								loader={
									<div className="w-full h-96 bg-gray-200 animate-pulse flex items-center justify-center">
										Betöltés...
									</div>
								}
								unloader={
									<div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-500">
										Hiba a kép betöltésében
									</div>
								}
							/>
						)}
					</div>
					{/* Jobb oldal: Szöveg */}
					<div className="md:w-1/2 text-white">
						<h1 className="text-3xl font-bold mb-4">{product.name}</h1>
						<p className="text-lg mb-4">{product.description}</p>
						<p className="text-xl font-semibold mb-2">
							{new Intl.NumberFormat('hu-HU', { useGrouping: true }).format(product.price)} Ft
						</p>
						<p className="text-sm mb-4">Készlet: {product.stock} db</p>
						<button
							className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-slate-700 transition-colors"
							onClick={handleAddToCart}
						>
							Kosárba rakom
						</button>
						{isAuthenticated && (
							<div className="mt-6">
								<Link
									to={`/update-product/${product.id}`}
									className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-slate-700 transition-colors"
								>
									Szerkesztés
								</Link>
								<button
									onClick={() => setShowModal(true)}
									className="px-4 py-2 bg-red-950 text-white rounded hover:bg-slate-700 transition-colors"
								>
									Törlés
								</button>
								{showModal && (
									<div>
										<ConfirmModal
											onConfirm={deleteProduct}
											onCancel={() => setShowModal(false)}
											message="Biztos törölni akarod a terméket?"
										/>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
