import { useRef, useState, useEffect, useCallback } from 'react';
import { PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';
import ControlPanel from './components/GameUI/ControlPanel';
import HistoryPanel from './components/GameUI/HistoryPanel';
import SettingsPanel from './components/GameUI/SettingsPanel';

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
        bg: 'bg_office', 
        character: 'kotik_normal', 
        name: "Котик", 
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

function App() {
    const phaserRef = useRef();
    const [step, setStep] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    
    const [isAuto, setIsAuto] = useState(false);
    const [isSkip, setIsSkip] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({ textSpeed: 25, fontSize: 18 });

    const typingTimer = useRef(null);

    const startTyping = (text) => {
        if (typingTimer.current) clearInterval(typingTimer.current);
        setDisplayText("");
        setIsTyping(true);
        let i = 0;
        const speed = isSkip ? 1 : settings.textSpeed;

        typingTimer.current = setInterval(() => {
            i++;
            setDisplayText(text.substring(0, i));
            if (i >= text.length) {
                clearInterval(typingTimer.current);
                setIsTyping(false);
            }
        }, speed);
    };

    const handleNext = useCallback(() => {
        // Если текст печатается, при клике показываем его целиком
        if (isTyping && !isSkip) {
            setDisplayText(SCRIPT[step].text || "");
            setIsTyping(false);
            if (typingTimer.current) clearInterval(typingTimer.current);
            return;
        }

        // Если экран выбора или конец - блокируем переход по клику на экран
        if (SCRIPT[step].showChoices || SCRIPT[step].end) {
            return;
        }

        if (step < SCRIPT.length - 1) {
            setStep(s => s + 1);
        }
    }, [step, isTyping, isSkip]);

    useEffect(() => {
        const line = SCRIPT[step];
        if (line) {
            if (line.text) {
                startTyping(line.text);
                
                // Исправление истории: обрезаем её до текущего шага, чтобы не было дублей при "Назад"
                setHistory(prev => {
                    const cleanHistory = prev.slice(0, step);
                    return [...cleanHistory, { name: line.name, text: line.text, isChoice: false }];
                });
            }
            
            // Отправляем команду в Phaser
            EventBus.emit('update-visuals', { ...line });
        }
    }, [step]);

    const onAction = (type) => {
        if (type === 'auto') { setIsSkip(false); setIsAuto(!isAuto); }
        if (type === 'skip') { setIsAuto(false); setIsSkip(!isSkip); }
        if (type === 'history') setShowHistory(true);
        if (type === 'settings') setShowSettings(true);
        if (type === 'back' && step > 0) {
            setIsAuto(false); 
            setIsSkip(false);
            setStep(prev => prev - 1);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={gameWrapperStyle} onPointerDown={() => {if (!isAuto && !isSkip){handleNext()}}}>
                <PhaserGame ref={phaserRef} />
                
                {/* Скрываем диалог, если это экран "end" */}
                {!SCRIPT[step].end && (
                    <div style={{...dialogBoxStyle, fontSize: `${settings.fontSize}px`}}>
                        {SCRIPT[step].name && <div style={nameStyle}>{SCRIPT[step].name}</div>}
                        <div style={{lineHeight: '1.4'}}>{displayText}</div>
                    </div>
                )}

                <ControlPanel 
                    onAction={onAction} 
                    states={{ isAuto, isSkip }} 
                    isTyping={isTyping}
                    currentStep={step}
                    handleNext={handleNext}
                />

                {showHistory && <HistoryPanel history={history} onClose={() => setShowHistory(false)} />}
                {showSettings && <SettingsPanel settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />}

                {/* Выбор вариантов */}
                {SCRIPT[step].showChoices && !isTyping && (
                    <div style={choicesStyle} onPointerDown={e => e.stopPropagation()}>
                        <div style={choicesContainerStyle}>
                            {SCRIPT[step].choices.map((choice, index) => (
                                <button 
                                    key={index} 
                                    style={btnChoice} 
                                    onClick={() => {
                                        setHistory(prev => [...prev, { text: choice.text, isChoice: true }]);
                                        setStep(step + 1);
                                    }}
                                >
                                    {choice.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Стили
const containerStyle = { 
    width: '100vw', 
    height: '100vh', 
    backgroundColor: '#000', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden' 
};

const gameWrapperStyle = { 
    width: '100%', 
    height: '100%', 
    position: 'relative', 
    overflow: 'hidden' 
};

const dialogBoxStyle = { 
    position: 'absolute', 
    bottom: 'max(70px, env(safe-area-inset-bottom))', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    width: '95%', 
    maxWidth: '650px', 
    backgroundColor: 'rgba(0, 0, 0, 0.85)', 
    borderRadius: '12px', 
    padding: '18px 22px', 
    color: 'white', 
    zIndex: 10, 
    boxSizing: 'border-box', 
    pointerEvents: 'none', 
    border: '1px solid rgba(255, 255, 255, 0.15)' 
};

const nameStyle = { color: '#ffcc00', fontWeight: 'bold', marginBottom: '6px', fontSize: '1.1em' };

const choicesStyle = { 
    position: 'absolute', 
    inset: 0, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    zIndex: 110 
};

const choicesContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '85%',
    maxWidth: '400px'
};

const btnChoice = { 
    padding: '16px 20px', 
    borderRadius: '10px', 
    border: '1px solid rgba(255,255,255,0.2)', 
    background: 'linear-gradient(180deg, #028af8 0%, #026dc5 100%)', 
    color: 'white', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    fontSize: '16px' 
};

export default App;