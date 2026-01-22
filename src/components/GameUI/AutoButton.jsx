import React, { useEffect, useRef } from 'react';

const AutoButton = ({ isActive, isTyping, onToggle, onNext, currentStep }) => {
    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive && !isTyping) {
            // Если авто включено и текст допечатался — ждем 4 сек и идем дальше
            timerRef.current = setTimeout(() => {
                onNext();
            }, 1500);
        } else {
            clearTimeout(timerRef.current);
        }
        return () => clearTimeout(timerRef.current);
    }, [isActive, isTyping, currentStep, onNext]);

    return (
        <button 
            style={{
                padding: '10px 5px', flex: 1, fontSize: '11px', borderRadius: '5px', border: '1px solid #555', cursor: 'pointer', fontWeight: 'bold',
                backgroundColor: isActive ? '#ffcc00' : 'rgba(0,0,0,0.8)',
                color: isActive ? '#000' : '#fff'
            }}
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
        >
            АВТО
        </button>
    );
};

export default AutoButton;