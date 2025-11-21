import { useAuth } from '../contexts/AuthContext';
import PrivateNavbar from '../components/navigation/PrivateNavbar';
import PublicNavbar from '../components/navigation/PublicNavbar';
import { Outlet } from 'react-router-dom';

export default function MainLayouts() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-[#B7B89F]">
				<div className="text-lg">Betöltés....</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-sky-950">
			<header className="bg-sky-900 shadow-sm">
				{isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}
			</header>
			<main className="container mx-auto px-4 py-8">
				<Outlet />
			</main>
		</div>
	);
}
