import React from 'react';

interface ImagePreviewProps {
    imageSrc: string;
    onRetake: () => void;
    onConfirm: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageSrc, onRetake, onConfirm }) => {
    return (
        <div className="p-4 border rounded bg-slate-800 text-white text-center">
            <img src={imageSrc} alt="Preview" className="max-w-full h-auto mb-4" />
            <div className="flex gap-4 justify-center">
                <button onClick={onRetake} className="px-4 py-2 bg-red-500 rounded">Retake</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-green-500 rounded">Confirm</button>
            </div>
        </div>
    );
};
