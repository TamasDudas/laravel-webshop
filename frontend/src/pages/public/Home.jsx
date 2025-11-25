import { useProducts } from '../../contexts/ProductsContext';

import { useEffect } from 'react';
import ProductsList from '../../components/ProductsList';

export default function Home() {
	const { products, loading, error, fetchProduct, lastPage, currentPage, setCurrentPage } =
		useProducts();

	useEffect(() => {
		fetchProduct(currentPage); // Termékek betöltése komponens mountkor
	}, []);

	if (loading) {
		return <p>Betöltés...</p>;
	}

	if (error) {
		return <p>Hiba: {error}</p>;
	}

	const prevPage = () => {
		if (currentPage > 1) {
			const newPage = currentPage - 1;
			setCurrentPage(newPage);
			fetchProduct(newPage);
		}
	};

	const nextPage = () => {
		if (currentPage < lastPage) {
			const newPage = currentPage + 1;
			setCurrentPage(newPage);
			fetchProduct(newPage);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl text-slate-500 font-bold mb-4">Termékek</h1>
			<ProductsList products={products} />

			{lastPage > 1 && (
				<nav className="mt-4 flex justify-center space-x-4">
					<button
						onClick={prevPage}
						disabled={currentPage === 1}
						className="px-4 py-2 bg-slate-800 text-white rounded disabled:bg-gray-300"
					>
						Előző
					</button>
					<span className="px-4 py-2 text-slate-400">
						{currentPage} / {lastPage}
					</span>
					<button
						onClick={nextPage}
						disabled={currentPage === lastPage}
						className="px-4 py-2 bg-slate-800 text-white rounded disabled:bg-gray-300"
					>
						Következő
					</button>
				</nav>
			)}
		</div>
	);
}
