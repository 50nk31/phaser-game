import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CLASSES = [
    { id: 'prog', name: 'Программист', icon: 'card_coder', desc: 'Мастер кода и логики. Создает цифровые миры.' },
    { id: 'mech', name: 'Автомеханик', icon: 'card_mechanic', desc: 'Понимает язык машин. Оживляет любой механизм.' },
    { id: 'adv', name: 'Рекламщик', icon: 'card_adv', desc: 'Знает, как привлечь внимание и убедить любого.' },
    { id: 'lock', name: 'Слесарь', icon: 'card_lock', desc: 'Ювелирная точность и работа с металлом.' }
];

const ClassSelector = ({ onClassSelect }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const cardsRef = useRef([]);
    const glowsRef = useRef([]); 
    const isDragging = useRef(false);
    const startX = useRef(0);

    // ВАЖНО: На Vercel путь должен начинаться с "/" (относительно папки public)
    const getAssetPath = (iconName) => `/${iconName}.png`; 
    // Если твои картинки в public/assets, используй: `/${iconName}.png`
    // Убедись, что файлы лежат ПРЯМО в public/ (или поправь путь ниже)

    useEffect(() => {
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            const glow = glowsRef.current[i];
            
            let diff = i - activeIndex;
            const len = CLASSES.length;
            if (diff > len / 2) diff -= len;
            if (diff < -len / 2) diff += len;

            const isCenter = i === activeIndex;

            gsap.to(card, {
                x: diff * (window.innerWidth < 500 ? 220 : 280), 
                z: isCenter ? 100 : -400,
                rotationY: isCenter ? (isFlipped ? 180 : 0) : diff * 40,
                scale: isCenter ? 1 : 0.75,
                opacity: Math.abs(diff) > 1.1 ? 0 : (isCenter ? 1 : 0.4),
                zIndex: isCenter ? 100 : 50 - Math.abs(diff) * 10,
                duration: 0.6,
                ease: "expo.out"
            });

            if (glow) {
                if (isCenter) {
                    gsap.to(glow, {
                        opacity: 1,
                        boxShadow: "0 0 20px 5px rgba(255, 204, 0, 0.6)", 
                        duration: 0.6
                    });
                } else {
                    gsap.to(glow, { opacity: 0, boxShadow: "0 0 0px 0px rgba(255, 204, 0, 0)", duration: 0.3 });
                }
            }
        });
    }, [activeIndex, isFlipped]);

    const onStart = (e) => { 
        isDragging.current = true;
        startX.current = e.clientX || (e.touches && e.touches[0].clientX); 
    };

    const onMove = (e) => {
        if (!isDragging.current) return;
        const currentX = e.clientX || (e.touches && e.touches[0].clientX);
        const dist = startX.current - currentX;
        if (Math.abs(dist) > 50) {
            dist > 0 ? setActiveIndex(p => (p + 1) % CLASSES.length) : setActiveIndex(p => (p - 1 + CLASSES.length) % CLASSES.length);
            setIsFlipped(false);
            isDragging.current = false;
        }
    };

    return (
        <div style={containerStyle} 
             onMouseDown={onStart} onMouseMove={onMove} onMouseUp={() => isDragging.current = false}
             onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={() => isDragging.current = false}>
            
            <div style={overlayStyle} />
            
            <div style={carouselViewport}>
                {CLASSES.map((cls, i) => (
                    <div key={cls.id} ref={el => cardsRef.current[i] = el} style={cardWrapper} 
                         onClick={() => i === activeIndex && setIsFlipped(!isFlipped)}>
                        
                        <div ref={el => glowsRef.current[i] = el} style={glowLayerStyle} />

                        <div style={cardInner}>
                            {/* ЛИЦО */}
                            <div style={{ 
                                ...commonFace, 
                                backgroundImage: `url("/assets/${cls.icon}.png")` 
                            }}>
                                <div style={labelNameTop}>{cls.name.toUpperCase()}</div>
                            </div>
                            {/* РУБАШКА */}
                            <div style={{ 
                                ...commonFace, 
                                ...backFaceStyle, 
                                backgroundImage: `url("/assets/card_back.png")` 
                            }}>
                                <div style={backContent}>
                                    <h2 style={innerTitleStyle}>{cls.name}</h2>
                                    <p style={descText}>{cls.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={uiLayer}>
                <button 
                    style={{ ...confirmBtnStyle, opacity: isFlipped ? 1 : 0, pointerEvents: isFlipped ? 'auto' : 'none' }}
                    onClick={(e) => { e.stopPropagation(); onClassSelect(CLASSES[activeIndex]); }}
                >
                    ВЫБРАТЬ
                </button>
            </div>
        </div>
    );
};

// Стили
const isMobile = window.innerWidth < 500;
const cardW = isMobile ? 220 : 260; 
const cardH = isMobile ? 366 : 433;

const containerStyle = { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', touchAction: 'none' };
const overlayStyle = { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: -1 };
const carouselViewport = { position: 'relative', width: `${cardW}px`, height: `${cardH}px`, perspective: '1200px' };
const cardWrapper = { position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', transformStyle: 'preserve-3d' };
const cardInner = { position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', pointerEvents: 'none' };
const commonFace = { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', borderRadius: '20px', backgroundSize: 'cover', backgroundPosition: 'center' };
const glowLayerStyle = { position: 'absolute', inset: '2px', borderRadius: '20px', backgroundColor: 'rgba(255, 204, 0, 0.15)', pointerEvents: 'none', zIndex: -1, opacity: 0 };
const backFaceStyle = { transform: 'rotateY(180deg)' };
const labelNameTop = { position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', background: '#ffcc00', color: '#000', padding: '6px 18px', borderRadius: '10px', fontWeight: '900', fontSize: '12px' };
const backContent = { height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', boxSizing: 'border-box' };
const innerTitleStyle = { color: '#ffcc00', fontSize: '18px', marginBottom: '10px' };
const descText = { color: '#fff', fontSize: '14px', lineHeight: '1.4' };
const uiLayer = { position: 'absolute', bottom: isMobile ? '30px' : '60px', textAlign: 'center', width: '100%' };
const confirmBtnStyle = { padding: '14px 40px', borderRadius: '30px', border: 'none', background: '#ffcc00', color: '#000', fontWeight: '900', fontSize: '15px', cursor: 'pointer' };

export default ClassSelector;
