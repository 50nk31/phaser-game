import React from 'react';
import AutoButton from './AutoButton';
import SkipButton from './SkipButton';

const ControlPanel = ({ onAction, states, isTyping, currentStep, handleNext }) => {
    return (
        <div 
            style={panelStyle}
            /* Блокируем клик на пустом месте между кнопками */
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <AutoButton 
                isActive={states.isAuto} 
                isTyping={isTyping} 
                currentStep={currentStep}
                onToggle={() => onAction('auto')} 
                onNext={handleNext}
            />
            <SkipButton 
                isActive={states.isSkip} 
                isTyping={isTyping} 
                currentStep={currentStep}
                onToggle={() => onAction('skip')} 
                onNext={handleNext}
            />
            <button style={btnStyle} onClick={(e) => { e.stopPropagation(); onAction('history'); }}>ИСТОРИЯ</button>
            <button style={btnStyle} onClick={(e) => { e.stopPropagation(); onAction('back'); }}>НАЗАД</button>
            <button style={btnStyle} onClick={(e) => { e.stopPropagation(); onAction('settings'); }}>ОПЦИИ</button>
        </div>
    );
};

const panelStyle = {
    position: 'absolute', 
    bottom: '15px', 
    left: '50%',
    transform: 'translateX(-50%)', 
    width: '98%',
    display: 'flex', 
    gap: '5px', 
    zIndex: 1000
};

const btnStyle = { 
    padding: '10px 5px', 
    flex: 1, 
    fontSize: '11px', 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    color: '#fff', 
    border: '1px solid #555', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
};

export default ControlPanel;
