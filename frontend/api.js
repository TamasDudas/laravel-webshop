import axios from 'axios';

function getAuthToken() {
	return localStorage.getItem('auth_token');
}

const api = axios.create({
	baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use(
	(config) => {
		const accessToken = getAuthToken();
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		console.log('Request error: ', error);
		return Promise.reject(error);
	}
);

export function setAuthToken(token) {
	if (token) {
		localStorage.setItem('auth_token', token);
		api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else {
		localStorage.removeItem('auth_token');
		delete api.defaults.headers.common['Authorization'];
	}
}
export default api;
