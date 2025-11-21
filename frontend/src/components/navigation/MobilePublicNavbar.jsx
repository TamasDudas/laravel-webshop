import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MobilePublicNavbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<nav className="max-w-4xl mx-auto p-4 ">
				<div className="flex justify-around">
					<Link to="/" className="text-xl font-bold w-1/3">
						Watch
					</Link>

					<button className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
						{!isOpen ? 'Menu' : 'Close'}
					</button>
				</div>

				{isOpen && (
					<div className="flex mt-6 flex-col justify-center items-center">
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
					</div>
				)}
			</nav>
		</>
	);
}
