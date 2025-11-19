import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import router from './Router.jsx';

function App() {
	return (
		<div className="min-h-screen bg-gray-50">
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</div>
	);
}

export default App;
