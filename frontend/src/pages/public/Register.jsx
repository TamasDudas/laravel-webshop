import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Form from '../../components/forms/Form';

export default function Register() {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/');
		}
	}, [isAuthenticated, navigate]);

	return (
		<div className="flex justify-center items-center mt-8">
			<div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
				<h1 className="text-2xl font-bold text-center mb-6">Regisztráció</h1>
				<Form isLogin={false} />
			</div>
		</div>
	);
}
