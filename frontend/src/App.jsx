import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import router from './Router.jsx';
import ProductsProvider from './contexts/ProductsContext.jsx';
import ProductProvider from './contexts/ProductContext.jsx';
import CategoriesProvider from './contexts/CategoriesContext.jsx';
import CartProvider from './contexts/CartContext.jsx';

function App() {
	return (
		<div className="min-h-screen">
			<CategoriesProvider>
				<ProductsProvider>
					<ProductProvider>
						<AuthProvider>
							<CartProvider>
								<RouterProvider router={router} />
							</CartProvider>
						</AuthProvider>
					</ProductProvider>
				</ProductsProvider>
			</CategoriesProvider>
		</div>
	);
}

export default App;
