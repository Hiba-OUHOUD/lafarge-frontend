import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { SkeletonStatsPage } from '../../components/Skeleton';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    ArcElement, Title, Tooltip, Legend, Filler
);

// Palette de couleurs
const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosClient.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <SkeletonStatsPage />;
    if (!stats) return (
        <div className="p-8 text-center text-red-500">
            Impossible de charger les statistiques.
        </div>
    );

    // --- Configuration des graphiques ---

    // 1. Doughnut : Formations par domaine
    const domains = Object.keys(stats.formationsByDomain || {});
    const domainData = {
        labels: domains,
        datasets: [{
            data: domains.map(d => stats.formationsByDomain[d]),
            backgroundColor: COLORS.slice(0, domains.length),
            borderColor: '#fff',
            borderWidth: 2,
        }]
    };

    // 2. Pie : Utilisateurs par rôle
    const roles = Object.keys(stats.usersByRole || {});
    const roleData = {
        labels: roles,
        datasets: [{
            data: roles.map(r => stats.usersByRole[r]),
            backgroundColor: ['#EF4444', '#8B5CF6', '#10B981'],
            borderColor: '#fff',
            borderWidth: 2,
        }]
    };

    // 3. Bar : Top 5 formations
    const topTrainings = stats.topTrainings || [];
    const topData = {
        labels: topTrainings.map(t => t.title.length > 25 ? t.title.substring(0, 25) + '...' : t.title),
        datasets: [{
            label: 'Nombre d\'inscrits',
            data: topTrainings.map(t => t.count),
            backgroundColor: '#3B82F6',
            borderRadius: 6,
        }]
    };

    // 4. Line : Inscriptions par mois
    const months = Object.keys(stats.enrollmentsByMonth || {});
    const monthData = {
        labels: months.map(m => {
            const [year, month] = m.split('-');
            const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            return `${monthNames[parseInt(month) - 1]} ${year.substring(2)}`;
        }),
        datasets: [{
            label: 'Inscriptions',
            data: months.map(m => stats.enrollmentsByMonth[m]),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10B981',
            pointRadius: 5,
        }]
    };

    // 5. Doughnut : Statut des inscriptions
    const statuses = Object.keys(stats.enrollmentsByStatus || {});
    const statusData = {
        labels: statuses.map(s => s === 'COMPLETED' ? 'Terminé' : 'En cours'),
        datasets: [{
            data: statuses.map(s => stats.enrollmentsByStatus[s]),
            backgroundColor: statuses.map(s => s === 'COMPLETED' ? '#10B981' : '#F59E0B'),
            borderColor: '#fff',
            borderWidth: 2,
        }]
    };

    // 6. Doughnut : Résultats des quiz
    const quizData = {
        labels: ['Réussis', 'Échoués'],
        datasets: [{
            data: [stats.quizResults.passed, stats.quizResults.failed],
            backgroundColor: ['#10B981', '#EF4444'],
            borderColor: '#fff',
            borderWidth: 2,
        }]
    };

    // Options communes
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
        }
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Statistiques</h1>
            <p className="text-gray-600 mb-8">Vue d'ensemble de la plateforme Lafarge E-Learning</p>

            {/* Cartes de totaux */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm">Utilisateurs</p>
                    <p className="text-3xl font-bold text-blue-700">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm">Formations</p>
                    <p className="text-3xl font-bold text-green-700">{stats.totalTrainings}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-yellow-500">
                    <p className="text-gray-500 text-sm">Inscriptions</p>
                    <p className="text-3xl font-bold text-yellow-700">{stats.totalEnrollments}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-purple-500">
                    <p className="text-gray-500 text-sm">Certificats délivrés</p>
                    <p className="text-3xl font-bold text-purple-700">{stats.totalCertificates}</p>
                </div>
            </div>

            {/* Graphiques - Ligne 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="font-bold text-lg mb-4 text-gray-700">📊 Formations par domaine</h2>
                    <div style={{ height: '300px' }}>
                        <Doughnut data={domainData} options={doughnutOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="font-bold text-lg mb-4 text-gray-700">👥 Utilisateurs par rôle</h2>
                    <div style={{ height: '300px' }}>
                        <Pie data={roleData} options={doughnutOptions} />
                    </div>
                </div>
            </div>

            {/* Graphiques - Ligne 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="font-bold text-lg mb-4 text-gray-700">🏆 Top 5 des formations</h2>
                    <div style={{ height: '300px' }}>
                        <Bar data={topData} options={barOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="font-bold text-lg mb-4 text-gray-700">📈 Inscriptions par mois</h2>
                    <div style={{ height: '300px' }}>
                        <Line data={monthData} options={barOptions} />
                    </div>
                </div>
            </div>

            {/* Graphiques - Ligne 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="font-bold text-lg mb-4 text-gray-700">🎯 Statut des inscriptions</h2>
                    <div style={{ height: '300px' }}>
                        <Doughnut data={statusData} options={doughnutOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="font-bold text-lg mb-4 text-gray-700">✅ Résultats des quiz</h2>
                    <div style={{ height: '300px' }}>
                        <Doughnut data={quizData} options={doughnutOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;