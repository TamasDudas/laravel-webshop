import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Outlet } from 'react-router-dom';

export default function MainLayouts() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-500">
				<div className="text-lg">Betöltés....</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* <header className="bg-white shadow-sm">
        {isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}
      </header> */}
			<main className="container mx-auto px-4 py-8">
				<Outlet />
			</main>
		</div>
	);
}
