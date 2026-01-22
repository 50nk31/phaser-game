import React, { useEffect, useRef } from 'react';

const SkipButton = ({ isActive, isTyping, onToggle, onNext, currentStep }) => {
    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            // В режиме пропуска щелкаем каждые 100мс
            timerRef.current = setTimeout(() => {
                onNext();
            }, 100);
        } else {
            clearTimeout(timerRef.current);
        }
        return () => clearTimeout(timerRef.current);
    }, [isActive, isTyping, currentStep, onNext]);

    return (
        <button 
            style={{
                padding: '10px 5px', flex: 1, fontSize: '11px', borderRadius: '5px', border: '1px solid #555', cursor: 'pointer', fontWeight: 'bold',
                backgroundColor: isActive ? '#ff4444' : 'rgba(0,0,0,0.8)',
                color: '#fff'
            }}
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
        >
            ПРОПУСК
        </button>
    );
};

export default SkipButton;