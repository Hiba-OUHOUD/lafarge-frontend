import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const VerifyCertificate = () => {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosClient.get(`/verify-certificate/${enrollmentId}`);
                setData(res.data);
            } catch (err) {
                setError(
                    err.response?.data?.error || 
                    'Certificat introuvable ou invalide.'
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [enrollmentId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Vérification en cours...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Certificat invalide
                    </h1>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <p className="text-xs text-gray-400">
                        Ce QR code ne correspond à aucun certificat valide dans notre système.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
                {/* En-tête de succès */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 text-center">
                    <div className="text-5xl mb-2">✅</div>
                    <h1 className="text-2xl font-bold">Certificat authentique</h1>
                    <p className="text-green-100 text-sm mt-1">
                        Ce certificat a été vérifié avec succès
                    </p>
                </div>

                {/* Corps */}
                <div className="p-8">
                    {/* En-tête Holcim */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-blue-900">HOLCIM ACADEMY</h2>
                        <p className="text-xs text-gray-500">Lafarge E-Learning Platform</p>
                    </div>

                    {/* Informations du titulaire */}
                    <div className="bg-blue-50 rounded-lg p-6 mb-6 text-center">
                        <p className="text-xs text-gray-600 mb-1">Ce certificat atteste que</p>
                        <p className="text-2xl font-bold text-blue-900 my-2">{data.employeeName}</p>
                        {data.employeePosition && (
                            <p className="text-sm text-gray-600">{data.employeePosition}</p>
                        )}
                    </div>

                    {/* Formation */}
                    <div className="text-center mb-6">
                        <p className="text-xs text-gray-600 mb-1">a complété avec succès la formation</p>
                        <p className="text-lg font-bold text-gray-800 italic">« {data.trainingTitle} »</p>
                        {data.trainingDomain && (
                            <p className="text-xs text-gray-500 mt-1">Domaine : {data.trainingDomain}</p>
                        )}
                    </div>

                    {/* Détails */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-xs text-gray-500 mb-1">Score obtenu</p>
                            <p className="text-2xl font-bold text-green-600">{data.score}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-xs text-gray-500 mb-1">Date d'obtention</p>
                            <p className="text-sm font-bold text-gray-800">
                                {data.completedDate 
                                    ? new Date(data.completedDate).toLocaleDateString('fr-FR')
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* N° de certificat */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-xs text-gray-500 mb-1">Numéro de certificat</p>
                        <p className="text-sm font-mono font-bold text-blue-900">{data.certificateNumber}</p>
                    </div>

                    {/* Signature formateur */}
                    <div className="text-center pt-4 border-t">
                        <p className="text-xs text-gray-500 mb-1">Formateur certifié</p>
                        <p className="text-lg italic text-gray-700">{data.trainerName}</p>
                    </div>
                </div>

                {/* Pied de page */}
                <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
                    Certificat vérifié électroniquement le{' '}
                    {new Date().toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
};

export default VerifyCertificate;