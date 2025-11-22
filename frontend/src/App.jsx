import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import router from './Router.jsx';
import ProductsProvider from './contexts/ProductsContext.jsx';

function App() {
	return (
		<div className="min-h-screen">
			<ProductsProvider>
				<AuthProvider>
					<RouterProvider router={router} />
				</AuthProvider>
			</ProductsProvider>
		</div>
	);
}

export default App;
