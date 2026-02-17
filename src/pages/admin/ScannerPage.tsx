import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';
import './ScannerPage.css';

const ScannerPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('upload');
    const [imagesSrc, setImagesSrc] = useState<string[]>([]);

    return (
        <div className="bg-background-dark min-h-screen text-slate-100 font-display pb-24">
            <div className="px-6 pt-12">
                <header className="mb-8"><h1 className="text-3xl font-medium text-white">Scanner<br />Intelligent</h1></header>
                {step === 'upload' && (
                    <div className="space-y-6">
                        <div className="w-full aspect-[4/3] bg-[#18282c]/30 border-2 border-dashed border-cyan-500/30 rounded-3xl flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-[28px] text-[#19c3e6]">photo_camera</span>
                            <h3 className="text-white font-bold mt-2">Prendre une photo</h3>
                        </div>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
};
export default ScannerPage;