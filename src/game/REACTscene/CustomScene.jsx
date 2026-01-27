import React, { useState, useEffect, useRef, useCallback } from 'react';
import ControlPanel from '../../components/GameUI/ControlPanel';
import NameInput from '../../components/GameUI/NameInput';
import ClassSelector from '../../components/GameUI/ClassSelector';
import SettingsPanel from '../../components/GameUI/SettingsPanel';

const FINAL_SCRIPT = (name, className) => [
    { text: `Вот это да! ${name}... ${className}. Облик под стать!`, name: "Котик" },
    { text: "Наш мир велик. Пора отправляться в путешествие.", name: "Котик" },
    { text: "Это — Карта Возможностей. Куда направимся первой?", name: "Котик" }
];

// Убедитесь, что setSettings передается в этот компонент из App.jsx
const CustomScene = ({ settings, setSettings, onAction, onComplete, addToHistory, removeFromHistory, isAuto, isSkip }) => {
    const [phase, setPhase] = useState('name');
    const [playerName, setPlayerName] = useState("");
    const [playerClass, setPlayerClass] = useState(null);
    const [step, setStep] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    
    const typingTimer = useRef(null);
    const prevStepRef = useRef(-1);
    const currentScript = FINAL_SCRIPT(playerName, playerClass?.name || "Путник");

    const handleNext = useCallback(() => {
        if (isTyping && !isSkip) {
            setDisplayText(currentScript[step].text);
            setIsTyping(false);
            if (typingTimer.current) clearInterval(typingTimer.current);
            return;
        }
        if (step < currentScript.length - 1) setStep(s => s + 1);
        else onComplete();
    }, [step, isTyping, isSkip, currentScript, onComplete]);

    const handleChangeName = () => {
        setPhase('name');
        setShowSettings(false);
    };

    useEffect(() => {
        if (phase !== 'finalDialogue') return;
        const line = currentScript[step];
        if (prevStepRef.current === step && !isTyping) return;
        
        clearInterval(typingTimer.current);
        let i = 0;
        if (prevStepRef.current === step) i = displayText.length;
        else {
            setDisplayText("");
            setIsTyping(true);
        }

        const speed = isSkip ? 1 : settings.textSpeed;
        typingTimer.current = setInterval(() => {
            i++;
            setDisplayText(line.text.substring(0, i));
            if (i >= line.text.length) {
                clearInterval(typingTimer.current);
                setIsTyping(false);
            }
        }, speed);

        if (step > prevStepRef.current) addToHistory({ name: line.name, text: line.text });
        prevStepRef.current = step;
        return () => clearInterval(typingTimer.current);
    }, [step, phase, settings.textSpeed, isSkip, currentScript, addToHistory]);

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'auto' }}>
            
            {phase === 'name' && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)' }} />
                    <NameInput onNameSubmit={(name) => { 
                        setPlayerName(name); 
                        if (playerClass) setPhase('finalDialogue');
                        else setPhase('class');
                    }} />
                    <div style={dialogBoxStyle}>
                        <div style={{color: 'gold'}}>Котик</div>
                        <div>Мяу! Назови себя!</div>
                    </div>
                </div>
            )}

            {phase === 'class' && (
                <ClassSelector onClassSelect={(selected) => { 
                    setPlayerClass(selected); 
                    setPhase('finalDialogue'); 
                }} />
            )}

            {phase === 'finalDialogue' && (
                <div style={{ position: 'absolute', inset: 0 }} onPointerDown={() => !isAuto && !isSkip && handleNext()}>
                    <div style={dialogBoxStyle}>
                        <div style={{ color: '#ffcc00', fontWeight: 'bold', marginBottom: '8px' }}>{currentScript[step].name}</div>
                        <div style={{ fontSize: `${settings.fontSize}px`, lineHeight: 1.4 }}>{displayText}</div>
                    </div>
                    <ControlPanel 
                        onAction={(type) => {
                            if (type === 'back') {
                                if (step > 0) {
                                    removeFromHistory();
                                    setStep(s => s - 1);
                                }
                                // Если step 0, ничего не делаем, не пробрасываем наверх.
                            } else if (type === 'settings') {
                                setShowSettings(true);
                            } else {
                                onAction(type);
                            }
                        }} 
                        states={{ isAuto, isSkip }} 
                        isTyping={isTyping} 
                        currentStep={step} 
                        handleNext={handleNext} 
                    />
                </div>
            )}

            {showSettings && (
                <SettingsPanel 
                    settings={settings} 
                    setSettings={setSettings} 
                    onClose={() => setShowSettings(false)} 
                    playerName={playerName}
                    onChangeName={handleChangeName}
                />
            )}
        </div>
    );
};

const dialogBoxStyle = { position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', width: '92%', maxWidth: '600px', backgroundColor: 'rgba(0,0,0,0.92)', padding: '20px', borderRadius: '12px', color: 'white', border: '1px solid #444', zIndex: 10 };

export default CustomScene;