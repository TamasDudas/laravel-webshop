import { useState } from 'react';

/**
 * Custom hook képek kezeléséhez termék form-ban.
 * Tartalmazza a képek state-jét, hozzáadást, eltávolítást és validációt.
 */
export function useImageHandler() {
	// Képek state-je: File objektumok tömbje
	const [images, setImages] = useState([]);

	/**
	 * Kép hozzáadása: validálja és felhalmozza a kiválasztott képeket.
	 * @param {FileList} files - A kiválasztott fájlok (input-ból)
	 * @param {Function} showAlert - Függvény alert megjelenítéséhez (opcionális)
	 */
	const addImages = (files, showAlert = alert) => {
		// FileList-et tömbbé alakítjuk
		const fileArray = Array.from(files);
		// Szűrjük: csak kép típusú fájlok (MIME típus alapján)
		const validFiles = fileArray.filter((file) => file.type.startsWith('image/'));
		// Ha nem minden fájl érvényes, figyelmeztetés
		if (validFiles.length !== fileArray.length) {
			showAlert('Csak képfájlokat lehet kiválasztani!');
		}
		// Érvényes képek hozzáadása a meglévőkhöz (felhalmozás)
		setImages((prev) => [...prev, ...validFiles]);
	};

	/**
	 * Kép eltávolítása index alapján.
	 * @param {number} index - Az eltávolítandó kép indexe
	 */
	const removeImage = (index) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	/**
	 * Összes kép törlése (reset).
	 */
	const clearImages = () => {
		setImages([]);
	};

	/**
	 * Képek hozzáadása FormData-hoz küldés előtt.
	 * @param {FormData} formData - A FormData objektum
	 */
	const appendImagesToFormData = (formData) => {
		if (images.length > 0) {
			images.forEach((image) => {
				formData.append('images[]', image);
			});
		}
	};

	return {
		images, // A képek tömbje
		addImages, // Képek hozzáadása
		removeImage, // Kép eltávolítása
		clearImages, // Összes kép törlése
		appendImagesToFormData, // FormData-hoz hozzáadás
	};
}
