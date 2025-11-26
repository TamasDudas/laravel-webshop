# Pagination Megvalósítása a ProductsContext.jsx-ben

````jsx
const ProductsContext = createContext({
products: [],
loading: false,
error: null,
currentPage: 1,
lastPage: 1,
perPage: 8,
totalPage: 0,
fetchProduct: async () => {},
});

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalPage, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(8);

async function fetchProduct(page = currentPage) {
try {
setLoading(true);
const fetchData = await api.get(`/products?page=${page}`);
const response = fetchData.data; // A teljes válasz, nem csak data.data
setProduct(response.data); // Termékek tömbje
setCurrentPage(response.current_page);
setLastPage(response.last_page);
setTotal(response.total);
setLoading(false);
} catch (error) {
console.error('Hiba a termékek lekérdezésekor:', error);
setError(error.response?.data?.message || 'Nem sikerült betölteni a termékeket');
} finally {
setLoading(false);
}
}

# Pagination Megvalósítása a Home.jsx-ben

Ez a dokumentum összefoglalja a termék lista pagination-jának megvalósítását a Home.jsx komponensben.

## useEffect Hook

A komponens mountkor betöltjük az első oldal termékeket:

```jsx
useEffect(() => {
	fetchProduct(currentPage); // Termékek betöltése komponens mountkor
}, []);
````

## Függvények a Léptetéshez

Az oldalak közötti navigációhoz használt függvények:

```jsx
const prevPage = () => {
	if (currentPage > 1) {
		const newPage = currentPage - 1;
		setCurrentPage(newPage);
		fetchProduct(newPage);
	}
};

const nextPage = () => {
	if (currentPage < lastPage) {
		const newPage = currentPage + 1;
		setCurrentPage(newPage);
		fetchProduct(newPage);
	}
};
```

## Megjelenítendő Gombok

A navigációs gombok JSX kódja, csak akkor jelenik meg, ha több oldal van:

```jsx
{
	lastPage > 1 && (
		<nav className="mt-4 flex justify-center space-x-4">
			<button
				onClick={prevPage}
				disabled={currentPage === 1}
				className="px-4 py-2 bg-slate-800 text-white rounded disabled:bg-gray-300"
			>
				Előző
			</button>
			<span className="px-4 py-2 text-slate-400">
				{currentPage} / {lastPage}
			</span>
			<button
				onClick={nextPage}
				disabled={currentPage === lastPage}
				className="px-4 py-2 bg-slate-800 text-white rounded disabled:bg-gray-300"
			>
				Következő
			</button>
		</nav>
	);
}
```

## Megjegyzések

- A `fetchProduct` függvény elfogad egy `page` paramétert az API híváshoz.
- A gombok disabled állapotban vannak, ha nem lehet váltani.
- A navigáció csak akkor jelenik meg, ha `lastPage > 1`.
