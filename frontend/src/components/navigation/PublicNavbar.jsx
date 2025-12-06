import React from 'react';
import { Link } from 'react-router-dom';
import MobilePublicNavbar from './MobilePublicNavbar';
import { useCart } from '../../contexts/CartContext';

export default function PublicNavbar() {
	const { getTotalItems } = useCart();
	return (
		<>
			<nav className="hidden md:flex max-w-4xl w-full mx-auto p-4 justify-between items-center">
				{/* Logo */}
				<Link to="/" className="text-xl font-bold">
					Watch
				</Link>

				{/* Nav links */}
				<div className="flex items-center space-x-4">
					<Link to="/" className="px-4 py-2 text-white hover:bg-blue-50 rounded-md">
						Home
					</Link>
				</div>
				<div className="flex items-center space-x-4">
					<Link to="/login" className="px-4 py-2 text-white hover:bg-blue-50 rounded-md">
						Belépés
					</Link>
				</div>
				<div className="flex items-center space-x-4">
					<Link to="/register" className="px-4 py-2 text-white hover:bg-blue-50  rounded-md">
						Regisztráció
					</Link>
				</div>
				<div>
					<Link to="/kosar" className="nav-link position-relative m-0">
						<i className="bi bi-cart3 fw-semibold text-dark"></i>

						<span className=" badge rounded-pill bg-success  py-2 text-slate-200">
							Kosár: {getTotalItems()}
						</span>
					</Link>
				</div>
			</nav>
			<div className="md:hidden">
				<MobilePublicNavbar />
			</div>
		</>
	);
}
