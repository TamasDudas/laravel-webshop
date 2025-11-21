import { createContext, useContext } from 'react';

const ProductContext = createContext({});

export const useProduct = () => {
	const context = useContext(ProductContext);

	if (!context) {
		throw Error('Nem létezik ilyen context');
	}

	return context;
};

export default function ProductProvider({ children }) {
	return <ProductContext.Provider>{children}</ProductContext.Provider>;
}
