import { createBrowserRouter } from 'react-router-dom';
import MainLayouts from './layouts/MainLayouts';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CreateProduct from './pages/private/CreateProduct';
import UpdateProduct from './pages/private/UpdateProduct';
import Register from './pages/public/Register';
import Product from './pages/public/Product';

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayouts />,
		children: [
			{
				index: true,
				element: <Home />,
			},

			//Ha nincs bejelentkezve
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/register',
				element: <Register />,
			},
			{
				path: '/products/:id',
				element: <Product />,
			},

			//Csak bejelentkezett felhasználó
			{
				path: '/create-product',
				element: (
					<ProtectedRoute>
						<CreateProduct />
					</ProtectedRoute>
				),
			},
			{
				path: '/update-product/:id',
				element: (
					<ProtectedRoute>
						<UpdateProduct />
					</ProtectedRoute>
				),
			},
		],
	},
]);
export default router;
