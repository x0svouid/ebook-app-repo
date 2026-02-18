import React from 'react';

interface StepProps {
    onNext: () => void;
    onSkip: () => void;
    currentStep: number;
    onGoToStep: (step: number) => void;
}

const OnboardingStep1: React.FC<StepProps> = ({ onNext, onSkip, currentStep, onGoToStep }) => {
    return (
        <div className="animate-fadeInUp" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="illustration-area">
                <div className="illustration-wrapper float-animation">
                    <svg fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                        <path className="svg-stroke-slate-200" d="M50 320C50 310 350 310 350 320" strokeLinecap="round" strokeWidth="2" />
                        <rect className="svg-fill-white svg-stroke-slate-900" x="120" y="270" width="160" height="30" rx="4" strokeWidth="2" />
                        <rect style={{ fill: 'rgba(252, 231, 243, 0.3)' }} className="svg-stroke-slate-900" x="115" y="235" width="160" height="30" rx="4" strokeWidth="2" />
                        <rect className="svg-fill-white svg-stroke-slate-900" x="125" y="200" width="160" height="30" rx="4" strokeWidth="2" />
                        <rect style={{ fill: 'rgba(25, 195, 230, 0.4)' }} className="svg-stroke-slate-900" x="118" y="165" width="160" height="30" rx="4" strokeWidth="2" />
                        <circle className="svg-fill-slate-300" cx="280" cy="110" r="15" style={{ fill: 'currentColor' }} />
                        <path d="M280 125C260 125 240 150 240 180C240 210 260 230 290 230" stroke="currentColor" strokeWidth="2" />
                        <path d="M290 125C310 125 330 150 330 180C330 210 310 230 280 230" stroke="currentColor" strokeWidth="2" />
                        <circle cx="80" cy="80" fill="#7C5CFF" fillOpacity="0.4" r="8" />
                        <circle cx="340" cy="120" fill="#F472B6" fillOpacity="0.2" r="12" />
                        <path d="M100 200L110 190M100 190L110 200" stroke="#7C5CFF" strokeLinecap="round" strokeWidth="2" />
                        <rect fill="#19c3e6" height="2" width="200" x="100" y="150" opacity="0.6">
                            <animate attributeName="y" dur="4s" repeatCount="indefinite" values="140;300;140" />
                        </rect>
                    </svg>
                </div>
            </div>

            <div className="text-area">
                <h1>Accédez à vos manuels de GF</h1>
                <p>Retrouvez vos manuels du GF directement avec une expérience de lecture optimisée</p>
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
                            <circle className="fill" cx="40" cy="40" r="38" strokeDashoffset="160" />
                        </svg>
                    </div>
                </button>

                <button className="skip-btn" onClick={onSkip}>Passer pour le moment</button>
            </div>
        </div>
    );
};

export default OnboardingStep1;
