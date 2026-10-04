import React from 'react';

const EmptyState = ({ icon = '📭', title, description, action }) => {
    return (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
            {description && (
                <p className="text-gray-500 text-sm mb-4">{description}</p>
            )}
            {action && (
                <div className="mt-4">{action}</div>
            )}
        </div>
    );
};

export default EmptyState;