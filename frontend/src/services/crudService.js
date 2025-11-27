import api from '../api';

/**
 * Általános CRUD API service minden entitáshoz
 * Csökkenti a duplikációt és egységesíti az API hívásokat
 */
export class CrudService {
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
	}

	/**
	 * Egy entitás lekérése ID alapján
	 */
	async fetchOne(id) {
		const response = await api.get(`/${this.baseUrl}/${id}`);
		return response.data.data;
	}

	/**
	 * Összes entitás lekérése (opcionális query paraméterekkel)
	 */
	async fetchAll(params = {}) {
		const response = await api.get(`/${this.baseUrl}`, { params });
		return response.data.data;
	}

	/**
	 * Új entitás létrehozása
	 */
	async create(data) {
		const response = await api.post(`/${this.baseUrl}`, data);
		return response.data;
	}

	/**
	 * Entitás frissítése
	 */
	async update(id, data) {
		const response = await api.post(`/${this.baseUrl}/${id}/update`, data);
		return response.data.data;
	}

	/**
	 * Entitás törlése
	 */
	async delete(id) {
		await api.delete(`/${this.baseUrl}/${id}`);
		return { success: true };
	}
}

// Specifikus service-ek az egyes entitásokhoz
export const productService = new CrudService('products');
export const categoryService = new CrudService('categories');
export const reviewService = new CrudService('reviews');
export const orderService = new CrudService('orders');
export const cartService = new CrudService('cart-items');
export const wishlistService = new CrudService('wish-lists');
export const addressService = new CrudService('addresses');
