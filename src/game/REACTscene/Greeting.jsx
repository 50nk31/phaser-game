import React, { useRef, useState, useEffect, useCallback } from 'react';
import { EventBus } from '../EventBus';
import ControlPanel from '../../components/GameUI/ControlPanel';

const SCRIPT = [
    { text: "(Дверь открывается...)", bg: 'bg_door', name: "" },
    { text: "Привет-привет! Заходи, не стесняйся! Я как раз тебя ждал.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "Меня зовут Котик. Я — карьерный наставник в этом центре.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "Моя задача — помочь таким талантливым котам, кошечкам и котищам, как ты, найти свою дорогу в профессиональном мире.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "У нас есть чёткий путь! Сначала изучим рынок труда и определим твои цели.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "...Потом освоим инструменты: резюме, портфолио, собеседования.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "А к выпуску ты выйдешь на старт карьеры с готовой стратегией роста.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "В умелых лапах они становятся магией, превращающей мечту в план, а план — в судьбу.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "Однако их истинную силу можно постичь только на практике, в деле... или в настоящем приключении.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { 
        text: "Поэтому я предлагаю тебе не семинар. Я предлагаю экспедицию.", 
        bg: 'bg_office', character: 'kotik_normal', name: "Котик", 
        showChoices: true,
        choices: [
            { text: "Конечно! Я готов к приключениям." },
            { text: "Путешествие? Звучит интригующе." },
            { text: "Ладно, почему бы и нет. Давайте попробуем." }
        ]
    },
    { text: "Вот так-то лучше!", bg: 'bg_magic_office', character: 'kotik_wizard', name: "Котик", flash: true },
    { text: "В каждом деле, особенно в таком важном, как поиск своего пути, без капельки волшебства не обойтись.", bg: 'bg_magic_office', character: 'kotik_wizard', name: "Котик" },
    { text: "Здесь, в этом лесу возможностей, я — не просто наставник. Я — Волшебник Карьерных Дорог.", bg: 'bg_magic_office', character: 'kotik_wizard', name: "Котик" },
    { text: "А раз уж мы стали попутчиками в этом путешествии, мне стоит узнать, с кем я иду бок о бок.", bg: 'bg_magic_office', character: 'kotik_wizard', name: "Котик" },
    { text: "Ведь чтобы выбрать верную тропу, нужно понять, кто путник.", bg: 'bg_magic_office', character: 'kotik_wizard', name: "Котик" },
    { text: "Давай расскажи о себе. Кто ты? И что привело тебя на порог моего — то есть, нашего — Центра Карьеры?", bg: 'bg_magic_office', character: 'kotik_wizard', name: "Котик" },
    { end: true } 
];

const Greeting = ({ settings, onAction, addToHistory, removeFromHistory, onComplete, isAuto, isSkip }) => {
    const [step, setStep] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const typingTimer = useRef(null);
    const prevStepRef = useRef(-1);

    const handleNext = useCallback(() => {
        if (isTyping && !isSkip) {
            setDisplayText(SCRIPT[step].text || "");
            setIsTyping(false);
            if (typingTimer.current) clearInterval(typingTimer.current);
            return;
        }
        if (SCRIPT[step].showChoices || SCRIPT[step].end) return;
        if (step < SCRIPT.length - 1) setStep(s => s + 1);
    }, [step, isTyping, isSkip]);

    useEffect(() => {
        const line = SCRIPT[step];
        if (!line || line.end) { if(line?.end) onComplete(); return; }

        if (prevStepRef.current === step && !isTyping) return;

        clearInterval(typingTimer.current);
        
        let i = 0;
        if (prevStepRef.current === step) {
            i = displayText.length; // Продолжаем с места остановки
        } else {
            setDisplayText(""); // Новый шаг — сброс
            setIsTyping(true);
        }

        const currentFullText = line.text || "";
        const speed = isSkip ? 1 : settings.textSpeed;

        typingTimer.current = setInterval(() => {
            i++;
            setDisplayText(currentFullText.substring(0, i));
            if (i >= currentFullText.length) {
                clearInterval(typingTimer.current);
                setIsTyping(false);
            }
        }, speed);

        if (step > prevStepRef.current && line.text) {
            addToHistory({ name: line.name, text: line.text });
        }
        
        prevStepRef.current = step;
        EventBus.emit('update-visuals', { ...line });

        return () => clearInterval(typingTimer.current);
    }, [step, settings.textSpeed, isSkip]);

    return (
        <div style={wrapperStyle} onPointerDown={() => !isAuto && !isSkip && handleNext()}>
            <div style={dialogBoxStyle}>
                {SCRIPT[step].name && <div style={nameStyle}>{SCRIPT[step].name}</div>}
                <div style={{fontSize: `${settings.fontSize}px`, lineHeight: 1.4}}>{displayText}</div>
            </div>

            <ControlPanel 
                onAction={(type) => {
                    if (type === 'back' && step > 0) {
                        removeFromHistory();
                        setStep(s => s - 1);
                    } else onAction(type);
                }} 
                states={{ isAuto, isSkip }} 
                isTyping={isTyping} 
                currentStep={step} 
                handleNext={handleNext} 
            />

            {SCRIPT[step].showChoices && !isTyping && (
                <div style={choicesOverlayStyle} onPointerDown={e => e.stopPropagation()}>
                    <div style={choicesContainerStyle}>
                        {SCRIPT[step].choices.map((choice, idx) => (
                            <button key={idx} style={btnChoice} onClick={() => setStep(step + 1)}>
                                {choice.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const wrapperStyle = { position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'auto' };
const dialogBoxStyle = { position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', width: '92%', maxWidth: '600px', backgroundColor: 'rgba(0,0,0,0.85)', padding: '20px', borderRadius: '12px', color: 'white', border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'auto' };
const nameStyle = { color: '#ffcc00', fontWeight: 'bold', marginBottom: '8px' };
const choicesOverlayStyle = { position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 20 };
const choicesContainerStyle = { display: 'flex', flexDirection: 'column', gap: '12px', width: '80%', maxWidth: '400px' };
const btnChoice = { padding: '15px 20px', borderRadius: '10px', background: 'linear-gradient(180deg, #028af8 0%, #026dc5 100%)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' };

export default Greeting;