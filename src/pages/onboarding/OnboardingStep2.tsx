import React from 'react';

interface StepProps {
    onNext: () => void;
    onSkip: () => void;
    currentStep: number;
    onGoToStep: (step: number) => void;
}

const OnboardingStep2: React.FC<StepProps> = ({ onNext, onSkip, currentStep, onGoToStep }) => {
    return (
        <div className="animate-fadeInUp" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="illustration-area">
                <div className="illustration-wrapper float-animation">
                    <svg fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                        <circle fill="#19c3e6" fillOpacity="0.1" cx="200" cy="200" r="120" style={{ filter: 'blur(40px)' }} />
                        <rect className="svg-fill-white svg-stroke-slate-200" x="80" y="60" width="240" height="300" rx="24" strokeWidth="4" />
                        <rect className="svg-fill-slate-50" x="95" y="80" width="210" height="260" rx="4" />
                        <rect className="svg-fill-slate-100" x="95" y="80" width="210" height="40" rx="4" />
                        <circle className="svg-fill-slate-300" cx="120" cy="100" r="6" />
                        <rect className="svg-fill-slate-200" x="140" y="96" width="120" height="8" rx="4" />
                        <rect fill="#19c3e6" x="115" y="140" width="100" height="12" rx="2" />
                        <rect className="svg-fill-slate-300" x="115" y="170" width="170" height="6" rx="2" />
                        <rect className="svg-fill-slate-300" x="115" y="185" width="160" height="6" rx="2" />
                        <rect className="svg-fill-slate-300" x="115" y="200" width="140" height="6" rx="2" />
                        <rect className="svg-fill-slate-400" x="115" y="230" width="80" height="10" rx="2" />
                        <rect className="svg-fill-slate-300" x="115" y="255" width="170" height="6" rx="2" />
                        <rect className="svg-fill-slate-300" x="115" y="270" width="150" height="6" rx="2" />
                        <rect className="svg-fill-slate-300" x="115" y="285" width="165" height="6" rx="2" />
                        <circle fill="#19c3e6" fillOpacity="0.2" cx="340" cy="100" r="20" />
                        <circle fill="#F472B6" fillOpacity="0.3" cx="60" cy="300" r="12" />
                        <path d="M330 180 L335 175 M330 175 L335 180" stroke="#19c3e6" strokeLinecap="round" strokeWidth="2" />
                        <circle fill="#19c3e6" cx="350" cy="220" r="3" />
                        <path fill="rgba(255,255,255,0.05)" d="M250 80 L305 80 L230 340 L175 340 Z" />
                    </svg>
                </div>
            </div>

            <div className="text-area">
                <h1>Lisez les enseignements du GF</h1>
                <p>Lisez vos leçons avec un confort de lecture optimal</p>
            </div>

            <div className="cta-area">
                <div className="dot-indicators">
                    {[1, 2, 3].map(i => (
                        <button key={i} className={`dot ${currentStep === i ? 'active' : ''}`} onClick={() => onGoToStep(i)} aria-label={`Page ${i}`} />
                    ))}
                </div>

                <button className="circular-cta" onClick={onNext} aria-label="Suivant">
                    <div className="glow" />
                    <div className="inner">
                        <span className="material-symbols-outlined">arrow_forward</span>
                        <svg className="progress-ring">
                            <circle className="track" cx="40" cy="40" r="38" />
                            <circle className="fill" cx="40" cy="40" r="38" strokeDashoffset="80" />
                        </svg>
                    </div>
                </button>

                <button className="skip-btn" onClick={onSkip}>Passer pour le moment</button>
            </div>
        </div>
    );
};

export default OnboardingStep2;
