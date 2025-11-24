import { useProducts } from '../../contexts/ProductsContext';
import { Img } from 'react-image'; // react-image importálása

export default function Home() {
	const { products, loading, error } = useProducts();

	if (loading) {
		return <p>Betöltés...</p>;
	}

	if (error) {
		return <p>Hiba: {error}</p>;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl text-slate-500 font-bold mb-4">Termékek</h1>
			<div className="grid grid-cols-1 py-3 md:grid-cols-4 gap-4">
				{products &&
					products.map((product) => (
						<div key={product.id} className=" rounded-xl p-4 shadow-xl">
							{/* Képek megjelenítése react-image Img komponenssel */}
							{product.images && product.images.length > 0 && (
								<Img
									src={`http://localhost:8000/storage/${product.images[0].image_path}`}
									alt={product.name}
									className="w-full h-48  object-cover rounded-lg border border-white"
									loader={
										<div className="w-full bg-gray-200 animate-pulse flex items-center justify-center">Betöltés...</div>
									} // Placeholder betöltés közben
									unloader={
										<div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500">
											Hiba a kép betöltésében
										</div>
									} // Fallback hiba esetén
								/>
							)}
							<h2 className=" text-slate-400 text-2xl font-medium mt-2">{product.name}</h2>
						</div>
					))}
			</div>
		</div>
	);
}
