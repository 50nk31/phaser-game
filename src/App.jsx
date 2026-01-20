import { useRef, useState, useEffect } from 'react';
import { PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';

const SCRIPT = [
    { text: "...", bg: 'bg_door', name: "" },
    { text: "Привет-привет! Заходи, не стесняйся! Я как раз тебя ждал.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "Меня зовут Котик. Я — карьерный наставник в этом центре. Моя задача — помочь таким талантливым котам, кошечкам и котищам, как ты, найти свою дорогу в профессиональном мире.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "У нас есть чёткий путь! Сначала изучим рынок труда и определим твои цели. Потом освоим инструменты: резюме, портфолио, собеседования. А к выпуску ты выйдешь на старт карьеры с готовой стратегией роста.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "В умелых лапах они становятся магией, превращающей мечту в план, а план — в судьбу. Однако их истинную силу можно постичь только на практике, в деле... или в настоящем приключении.", bg: 'bg_office', character: 'kotik_normal', name: "Котик" },
    { text: "Поэтому я предлагаю тебе не семинар. Я предлагаю экспедицию.", bg: 'bg_office', character: 'kotik_normal', name: "Котик", showChoices: true },
    { text: "Вот так-то лучше! В каждом деле, особенно в таком важном, как поиск своего пути, без капельки волшебства не обойтись.", bg: 'bg_magic_office', character: 'kotik_wizard', name: "Котик (Волшебник)", flash: true },
    { text: "Здесь, в этом лесу возможностей, я — не просто наставник. Я — Волшебник Карьерных Дорог. А раз уж мы стали попутчиками в этом путешествии, мне стоит узнать, с кем я иду бок о бок....", bg: 'bg_magic_office', character: 'kotik_wizard', name: "Котик (Волшебник)" },
    { end: true } 
];

function App() {
    const phaserRef = useRef();
    const [step, setStep] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const typingTimer = useRef(null);

    const startTyping = (text) => {
        if (!text) return;
        clearInterval(typingTimer.current);
        setDisplayText("");
        setIsTyping(true);
        let i = 0;
        typingTimer.current = setInterval(() => {
            i++;
            setDisplayText(text.substring(0, i));
            if (i >= text.length) {
                clearInterval(typingTimer.current);
                setIsTyping(false);
            }
        }, 25);
    };

    useEffect(() => {
        if (SCRIPT[step].text) {
            startTyping(SCRIPT[step].text);
            EventBus.emit('update-visuals', {
                bg: SCRIPT[step].bg,
                character: SCRIPT[step].character,
                flash: SCRIPT[step].flash
            });
        }
        return () => clearInterval(typingTimer.current);
    }, [step]);

    const handleNext = () => {
        if (SCRIPT[step].showChoices || SCRIPT[step].end) return;
        if (isTyping) {
            clearInterval(typingTimer.current);
            setDisplayText(SCRIPT[step].text);
            setIsTyping(false);
        } else if (step < SCRIPT.length - 1) {
            setStep(step + 1);
        }
    };

    return (
        <div style={containerStyle} onPointerDown={handleNext}>
            {/* Вставляем CSS для плавной анимации прямо в компонент */}
            <style>
                {`
                    @keyframes fadeInFade {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}
            </style>

            <PhaserGame ref={phaserRef} />
            
            {!SCRIPT[step].end && (
                <div style={dialogBoxStyle}>
                    {SCRIPT[step].name && <div style={nameStyle}>{SCRIPT[step].name}</div>}
                    <div style={textStyle}>{displayText}</div>
                </div>
            )}

            {SCRIPT[step].showChoices && (
                <div style={choicesOverlayStyle}>
                    <button style={btnStyle} onClick={(e) => { e.stopPropagation(); setStep(step + 1); }}>Конечно! Я готов.</button>
                    <button style={btnStyle} onClick={(e) => { e.stopPropagation(); setStep(step + 1); }}>Я в деле!</button>
                </div>
            )}

            {/* ФИНАЛЬНЫЙ ЭКРАН С ПЛАВНЫМ ПОЯВЛЕНИЕМ */}
            {SCRIPT[step].end && (
                <div style={endOverlayStyle}>
                    <h1 style={endTextStyle}>Создание персонажа в разработке</h1>
                </div>
            )}
        </div>
    );
}

const containerStyle = { width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#000', cursor: 'pointer', overflow: 'hidden' };
const dialogBoxStyle = { position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '600px', minHeight: '120px', backgroundColor: 'rgba(0, 0, 0, 0.75)', borderRadius: '15px', padding: '20px 25px', color: 'white', fontFamily: 'sans-serif', pointerEvents: 'none', zIndex: 10 };
const nameStyle = { color: '#f79f3b', fontWeight: 'bold', marginBottom: '8px', fontSize: '1.2rem' };
const textStyle = { fontSize: '1.05rem', lineHeight: '1.5' };
const choicesOverlayStyle = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', gap: '12px', zIndex: 100 };
const btnStyle = { padding: '15px 25px', width: '280px', borderRadius: '12px', border: 'none', background: '#028af8', color: 'white', cursor: 'pointer', fontSize: '1rem' };

// Обновленный стиль финального экрана:
const endOverlayStyle = { 
    position: 'absolute', 
    inset: 0, 
    backgroundColor: '#000', // Чистый черный для полного затемнения
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 2000,
    animation: 'fadeInFade 1.5s ease-in-out forwards' // Плавное проявление за 1.5 секунды
};

const endTextStyle = { 
    color: 'white', 
    fontFamily: 'sans-serif', 
    fontSize: '1.5rem', 
    textAlign: 'center',
    animation: 'fadeInFade 2.5s ease-in-out forwards' // Текст появляется чуть медленнее фона
};

export default App;
