import React from 'react';
import { Img } from 'react-image'; // react-image importálása
import { Link } from 'react-router-dom';

export default function ProductsList({ products, searchTerm, onResetSearch }) {
	// if (products.length === 0) {
	// 	if (searchTerm) {
	// 		return (
	// 			<div>
	// 				<h5>Nincs találat a "{searchTerm}" keresésre</h5>
	// 				<p>Próbálj más kulcsszavakat használni</p>
	// 				<button className="" onClick={onResetSearch}>
	// 					Összes termék megjelenítése
	// 				</button>
	// 			</div>
	// 		);
	// 	}

	// return <div className="text-center">Jelenleg nem érhető el termék a shopban</div>;
	// }
	return (
		<div className="grid grid-cols-1 py-3 md:grid-cols-4 gap-4">
			{products &&
				products.map((product) => (
					<Link key={product.id} to={`/products/${product.id}`} className=" rounded-xl p-4 shadow-xl">
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
					</Link>
				))}
		</div>
	);
}
