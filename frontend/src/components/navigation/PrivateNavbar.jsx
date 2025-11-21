import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MobilePrivateNavbar from './MobilePrivateNavbar';

export default function PrivateNavbar() {
	const { user, logout } = useAuth();

	const handleLogout = () => {
		logout();
	};

	return (
		<>
			<nav className="hidden md:flex max-w-4xl mx-auto p-4  justify-between items-center">
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
					<Link to="/create-product" className="px-4 py-2 text-white hover:bg-blue-50 rounded-md">
						Termék létrehozása
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
			</nav>
			<div className="md:hidden">
				<MobilePrivateNavbar user={user} handleLogout={handleLogout} />
			</div>
		</>
	);
}
