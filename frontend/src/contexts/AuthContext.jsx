import { createContext, use, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../api';

const AuthContext = createContext({
	user: null,
	loading: false,
	isAuthenticated: false,
	error: null,
	login: async () => {},
	registration: async () => {},
	logout: async () => {},
	clearError: () => {},
});

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw Error('Nem létezik ilyen context');
	}

	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	//localstorage ellenőrzése

	const checkAuthStatus = async () => {
		try {
			setLoading(true);
			const response = await api.get('/user');
			setUser(response.data);
			setIsAuthenticated(true);
		} catch (error) {
			setUser(null);
			setIsAuthenticated(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkAuthStatus();
	}, []);

	//Login
	const login = async (credentials) => {
		try {
			setLoading(true);

			const loginResponse = await api.post('/login', { ...credentials });

			const token = loginResponse.data.token;
			setAuthToken(token); //api.js-ből jön

			const userResponse = await api.get('/user');
			setUser(userResponse.data);
			setIsAuthenticated(true);
			return { success: true };
		} catch (error) {
			setLoading(false);
			return {
				success: false,
				error: error.response?.data?.message || 'Sikertelen bejelentkezés',
			};
		} finally {
			setLoading(false);
		}
	};
	//Regisztráció
	const registration = async (credentials) => {
		try {
			setLoading(true);
			const registerResponse = await api.post('/register', { ...credentials });

			const token = registerResponse.data.token;
			setAuthToken(token);

			const userResponse = await api.get('/user');
			setUser(userResponse.data);
			setIsAuthenticated(true);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.response?.data?.message || 'Sikertelen regisztráció',
			};
		} finally {
			setLoading(false);
		}
	};

	//Logout
	const logout = async () => {
		try {
			setLoading(true);
			await api.post('/logout');
			setAuthToken(null); // Token eltávolítása
			setUser(null);
			setIsAuthenticated(false);
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			setLoading(false);
		}
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, error, isAuthenticated, login, registration, logout, clearError }}
		>
			{children}
		</AuthContext.Provider>
	);
};
