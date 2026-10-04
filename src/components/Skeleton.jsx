import React from 'react';

// Skeleton de base (barre animée)
export const SkeletonLine = ({ width = 'w-full', height = 'h-4' }) => (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`}></div>
);

// Skeleton pour une carte de statistique
export const SkeletonStatCard = () => (
    <div className="bg-white p-5 rounded-lg shadow border-l-4 border-gray-300">
        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse mb-3"></div>
        <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
);

// Skeleton pour une ligne de tableau
export const SkeletonTableRow = ({ cols = 5 }) => (
    <tr className="border-b">
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
        ))}
    </tr>
);

// Skeleton pour une carte de formation
export const SkeletonTrainingCard = () => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-3">
            <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>
        <div className="flex gap-2">
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
    </div>
);

// Skeleton complet pour un tableau
export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
            <thead className="bg-blue-900">
                <tr>
                    {Array.from({ length: cols }).map((_, i) => (
                        <th key={i} className="p-3">
                            <div className="h-3 bg-blue-800 rounded animate-pulse"></div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: rows }).map((_, i) => (
                    <SkeletonTableRow key={i} cols={cols} />
                ))}
            </tbody>
        </table>
    </div>
);

// Skeleton pour un graphique
export const SkeletonChart = ({ title }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
    </div>
);

// Skeleton page complète (statistiques)
export const SkeletonStatsPage = () => (
    <div className="p-8">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-8"></div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonChart key={i} />)}
        </div>
    </div>
);

// Skeleton page formations
export const SkeletonTrainingGrid = ({ count = 4 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonTrainingCard key={i} />
        ))}
    </div>
);