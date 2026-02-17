import React from 'react';

export const ExtractionProgress: React.FC = () => {
    return (
        <div className="p-4 border rounded bg-slate-800 text-white text-center">
            <p>Processing...</p>
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-2"></div>
        </div>
    );
};
