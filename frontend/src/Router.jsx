import { createBrowserRouter } from 'react-router-dom';
import MainLayouts from './layouts/MainLayouts';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
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
				path: '/product/:id',
				element: <Product />,
			},

			//Csak bejelentkezett felhasználó
			{
				path: '/create-product',
			},
		],
	},
]);
export default router;
