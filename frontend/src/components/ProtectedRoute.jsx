import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<p>Betöltés...</p>
			</div>
		);
	}
	if (!isAuthenticated) {
		return <Navigate to="/login" />;
	}

	return children;
}
