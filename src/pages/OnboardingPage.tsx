import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OnboardingStep1 from './onboarding/OnboardingStep1';
import OnboardingStep2 from './onboarding/OnboardingStep2';
import OnboardingStep3 from './onboarding/OnboardingStep3';
import './onboarding/Onboarding.css';

const Onboarding: React.FC = () => {
    const [step, setStep] = useState(1);
    const [isDark, setIsDark] = useState(true);
    const { updateProfile } = useAuth();
    const navigate = useNavigate();

    const handleNext = useCallback(async () => {
        if (step < 3) {
            setStep(s => s + 1);
        } else {
            // Finished - Always mark as seen when they complete the flow
            try {
                await updateProfile({
                    data: { has_seen_onboarding: true }
                });
            } catch (error) {
                console.error("Error updating profile:", error);
            }
            navigate('/reader');
        }
    }, [step, navigate, updateProfile]);

    const handleSkip = useCallback(async () => {
        // Skip intro — mark as seen so it doesn't show again
        try {
            await updateProfile({
                data: { has_seen_onboarding: true }
            });
        } catch (error) {
            console.error("Error updating profile:", error);
        }
        navigate('/reader');
    }, [navigate, updateProfile]);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => !prev);
    }, []);

    const handleGoToStep = useCallback((target: number) => {
        if (target >= 1 && target <= 3) setStep(target);
    }, []);

    return (
        <div className={`onboarding-container ${isDark ? '' : 'light-mode'}`}>
            {/* Ambient glows */}
            <div className="ambient-glow-1" />
            <div className="ambient-glow-2" />

            {/* Theme toggle */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Changer le thème">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {isDark ? 'light_mode' : 'dark_mode'}
                </span>
            </button>

            {/* Steps */}
            {step === 1 && <OnboardingStep1 onNext={handleNext} onSkip={handleSkip} currentStep={step} onGoToStep={handleGoToStep} />}
            {step === 2 && <OnboardingStep2 onNext={handleNext} onSkip={handleSkip} currentStep={step} onGoToStep={handleGoToStep} />}
            {step === 3 && <OnboardingStep3 onNext={handleNext} onSkip={handleSkip} currentStep={step} onGoToStep={handleGoToStep} />}

            {/* Home indicator */}
            <div className="home-indicator" />
        </div>
    );
};

export default Onboarding;
