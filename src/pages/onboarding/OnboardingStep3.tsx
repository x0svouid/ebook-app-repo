import React from 'react';

interface StepProps {
    onNext: () => void;
    onSkip: () => void;
    currentStep: number;
    onGoToStep: (step: number) => void;
}

const OnboardingStep3: React.FC<StepProps> = ({ onNext, onSkip, currentStep, onGoToStep }) => {
    return (
        <div className="animate-fadeInUp" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="illustration-area">
                <div className="illustration-wrapper float-animation">
                    <svg fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                        <circle className="svg-fill-slate-100" cx="200" cy="200" r="140" style={{ opacity: 0.5 }} />
                        <path className="svg-fill-white svg-stroke-slate-900" d="M140 100 H260 V280 L200 240 L140 280 V100 Z" strokeWidth="2" />
                        <path className="svg-stroke-slate-200" d="M150 120 H250" strokeLinecap="round" strokeWidth="2" />
                        <path className="svg-stroke-slate-200" d="M150 140 H250" strokeLinecap="round" strokeWidth="2" />
                        <path className="svg-stroke-slate-200" d="M150 160 H220" strokeLinecap="round" strokeWidth="2" />
                        <circle fill="#19c3e6" cx="280" cy="110" r="15" />
                        <path d="M280 125C260 125 240 150 240 180C240 210 260 230 290 230" stroke="currentColor" strokeWidth="2" />
                        <path d="M290 125C310 125 330 150 330 180C330 210 310 230 280 230" stroke="currentColor" strokeWidth="2" />
                        <circle cx="80" cy="160" fill="#19c3e6" fillOpacity="0.6" r="6" />
                        <circle cx="320" cy="260" fill="#F472B6" fillOpacity="0.4" r="10" />
                        <circle fill="#19c3e6" cx="200" cy="200" r="25" style={{ filter: 'drop-shadow(0 4px 6px rgba(25,195,230,0.3))' }} />
                        <path d="M190 200 L197 207 L212 192" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                        <rect className="svg-fill-slate-200" x="120" y="320" width="160" height="6" rx="3" />
                        <rect fill="#19c3e6" x="120" y="320" height="6" rx="3">
                            <animate attributeName="width" dur="4s" repeatCount="indefinite" values="40;120;120;40" />
                        </rect>
                    </svg>
                </div>
            </div>

            <div className="text-area">
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', letterSpacing: '0.025em' }}>
                    Ne cherchez plus la prochaine leçon
                </h1>
                <p style={{ maxWidth: '320px' }}>
                    Utilisez les marque-pages et le suivi intelligent pour reprendre vos leçons exactement là où vous vous êtes arrêté.
                </p>
            </div>

            <div className="cta-area">
                <div className="dot-indicators">
                    {[1, 2, 3].map(i => (
                        <button key={i} className={`dot ${currentStep === i ? 'active' : ''}`} onClick={() => onGoToStep(i)} aria-label={`Page ${i}`} />
                    ))}
                </div>

                <button className="cta-fullwidth" onClick={() => onNext()}>
                    Commencer l'apprentissage
                </button>

                <button className="skip-btn" onClick={onSkip}>Passer l'introduction</button>
            </div>
        </div>
    );
};

export default OnboardingStep3;
