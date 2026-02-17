import React from 'react';

interface ResultEditorProps {
    result: any;
    onSave: (data: any) => void;
    onCancel: () => void;
}

export const ResultEditor: React.FC<ResultEditorProps> = ({ result, onSave, onCancel }) => {
    return (
        <div className="p-4 border rounded bg-slate-800 text-white">
            <h3 className="text-xl mb-4">Edit Result</h3>
            <pre className="bg-black p-2 rounded mb-4 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            <div className="flex gap-4">
                <button onClick={() => onSave(result)} className="px-4 py-2 bg-blue-500 rounded">Save</button>
                <button onClick={onCancel} className="px-4 py-2 bg-gray-500 rounded">Cancel</button>
            </div>
        </div>
    );
};
