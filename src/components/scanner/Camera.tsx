import React from 'react';

interface CameraProps {
    onCapture: (file: File) => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture }) => {
    return (
        <div className="p-4 border rounded bg-slate-800 text-white text-center">
            <p>Camera Component Placeholder</p>
            <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                    if (e.target.files?.[0]) onCapture(e.target.files[0]);
                }}
            />
        </div>
    );
};
