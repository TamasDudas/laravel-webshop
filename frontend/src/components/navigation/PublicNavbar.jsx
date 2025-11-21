import React from 'react';
import { Link } from 'react-router-dom';
import MobilePublicNavbar from './MobilePublicNavbar';

export default function PublicNavbar() {
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
			</nav>
			<div className="md:hidden">
				<MobilePublicNavbar />
			</div>
		</>
	);
}
