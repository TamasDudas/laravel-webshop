import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MobilePrivateNavbar({ user, handleLogout }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<nav className="max-w-4xl mx-auto p-4 ">
				<div className="flex justify-around">
					<Link to="/" className="text-xl font-bold w-1/3">
						Appworld Fullstack
					</Link>

					<button className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
						{!isOpen ? 'Menu' : 'Close'}
					</button>
				</div>

				{isOpen && (
					<div className="flex mt-6 flex-col justify-center items-center">
						<div className="flex items-center space-x-4">
							<Link to="/" className="px-4 py-2 text-white hover:bg-blue-50 rounded-md">
								Watch
							</Link>
						</div>
						<div className="flex items-center space-x-4">
							<Link to="/create-product" className="px-4 py-2 text-white hover:bg-blue-50 rounded-md">
								Termék létrehozása
							</Link>
						</div>
						<div className="flex items-center space-x-4">
							<Link to="/categories" className="px-4 py-2 text-white hover:bg-blue-50 rounded-md">
								Kategóriák
							</Link>
						</div>
						{/* user info */}
						<div className="flex items-center space-x-4 py-1">
							<span>Hello, {user?.name}!</span>
							<button
								onClick={handleLogout}
								className="px-2 py-1 text-white bg-red-700 hover:bg-red-900 cursor-pointer rounded-md"
							>
								Kilépés
							</button>
						</div>
					</div>
				)}
			</nav>
		</>
	);
}
