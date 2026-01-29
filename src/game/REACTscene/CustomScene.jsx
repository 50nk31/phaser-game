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
        setPhase('name'); setStep(0); setDisplayText(""); setShowSettings(false);
    };

    const handleChangeClass = () => {
        setPhase('class'); setStep(0); setDisplayText(""); setShowSettings(false);
    };

    useEffect(() => {
        if (phase !== 'finalDialogue') return;
        const line = currentScript[step];
        if (prevStepRef.current === step && !isTyping) return;
        
        clearInterval(typingTimer.current);
        let i = 0;
        if (prevStepRef.current === step) i = displayText.length;
        else { setDisplayText(""); setIsTyping(true); }

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
            
            {(phase === 'name' || phase === 'finalDialogue') && (
                <div style={{ position: 'absolute', inset: 0 }} onPointerDown={() => phase === 'finalDialogue' && !isAuto && !isSkip && handleNext()}>
                    
                    {phase === 'name' && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)' }} />
                            <NameInput onNameSubmit={(name) => { 
                                setPlayerName(name); 
                                if (playerClass) setPhase('finalDialogue'); else setPhase('class');
                            }} />
                        </div>
                    )}

                    <div style={dialogBoxStyle}>
                        <div style={nameLabelStyle}>
                            {phase === 'name' ? 'Котик' : currentScript[step].name}
                        </div>
                        <div style={{ 
                            fontSize: `${settings.fontSize}px`, 
                            lineHeight: 1.4,
                        }}>
                            {phase === 'name' ? 'Мяу! Назови себя!' : displayText}
                        </div>
                    </div>

                    {phase === 'finalDialogue' && (
                        <ControlPanel 
                            onAction={(type) => {
                                if (type === 'back') {
                                    if (step > 0) { removeFromHistory(); setStep(s => s - 1); }
                                } else if (type === 'settings') { setShowSettings(true); }
                                else { onAction(type); }
                            }} 
                            states={{ isAuto, isSkip }} 
                            isTyping={isTyping} 
                            currentStep={step} 
                            handleNext={handleNext} 
                        />
                    )}
                </div>
            )}

            {phase === 'class' && (
                <ClassSelector onClassSelect={(selected) => { setPlayerClass(selected); setPhase('finalDialogue'); }} />
            )}

            {showSettings && (
                <SettingsPanel 
                    settings={settings} setSettings={setSettings} 
                    onClose={() => setShowSettings(false)} 
                    playerName={playerName.trim() !== "" ? playerName : null}
                    playerClass={playerClass}
                    onChangeName={handleChangeName}
                    onChangeClass={playerClass ? handleChangeClass : null}
                />
            )}
        </div>
    );
};

// --- СТИЛИ С ПРАВИЛЬНЫМИ ОТСТУПАМИ ---

const dialogBoxStyle = { 
    position: 'absolute', 
    bottom: '60px', // Установлено так, чтобы касаться верхней границы ControlPanel
    left: '50%', 
    transform: 'translateX(-50%)', 
    width: '92%', // Возвращаем отступы по бокам
    maxWidth: '600px', 
    backgroundColor: 'rgba(20, 20, 20, 0.95)', 
    padding: '16px 20px', 
    borderRadius: '12px 12px 0 0', // Скругляем только верх, так как низ прижат к кнопкам
    color: 'white', 
    border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderBottom: 'none', // Убираем нижнюю рамку для бесшовного стыка
    zIndex: 10,
    boxShadow: '0 -5px 20px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80px',
    // Плавный рост при добавлении строк
    transition: 'all 0.3s ease-out',
    pointerEvents: 'none'
};

const nameLabelStyle = { 
    color: '#ffcc00', 
    fontWeight: '700', 
    marginBottom: '6px', 
    fontSize: '13px', 
    textTransform: 'uppercase', 
    letterSpacing: '1px'
};

export default CustomScene;