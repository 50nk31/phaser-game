import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const NameInput = ({ onNameSubmit }) => {
    const [val, setVal] = useState("");
    const cardRef = useRef(null);

    // 1. Анимация появления сверху
    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(cardRef.current, 
                { y: -800, opacity: 0, rotationX: -30 }, 
                { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: "back.out(1.2)", delay: 0.1 }
            );
        }
    }, []);

    // 2. Эффект тряски при достижении лимита
    useEffect(() => {
        if (val.length === 20 && cardRef.current) {
            gsap.to(cardRef.current, {
                x: "+=6",
                duration: 0.05, 
                repeat: 5,
                yoyo: true,
                ease: "sine.inOut",
                onComplete: () => { gsap.to(cardRef.current, { x: 0, duration: 0.1 }); }
            });
            gsap.fromTo(cardRef.current, 
                { borderColor: '#ffcc00' }, 
                { borderColor: '#ff4444', duration: 0.3, yoyo: true, repeat: 1 }
            );
        }
    }, [val]);

    const handleSubmit = () => {
        const trimmed = val.trim();
        if (trimmed.length > 0 && trimmed.length <= 20) {
            gsap.to(cardRef.current, {
                y: 500,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => onNameSubmit(trimmed)
            });
        } else {
            gsap.to(cardRef.current, { x: "+=10", duration: 0.05, repeat: 3, yoyo: true });
        }
    };

    return (
        <div ref={cardRef} style={inputCardStyle}>
            <h3 style={headerStyle}>КАК ТЕБЯ ЗОВУТ?</h3>
            
            <div style={inputWrapper}>
                <input 
                    type="text" 
                    value={val} 
                    onChange={e => setVal(e.target.value)}
                    maxLength={20}
                    placeholder="Путник..."
                    style={inputFieldStyle}
                    autoFocus
                />
                {/* Счётчик удален отсюда */}
            </div>

            <button 
                onClick={handleSubmit}
                disabled={!val.trim()}
                style={{
                    ...submitBtnStyle,
                    opacity: val.trim() ? 1 : 0.5,
                    cursor: val.trim() ? 'pointer' : 'not-allowed'
                }}
            >
                ПРОДОЛЖИТЬ
            </button>
        </div>
    );
};

// --- СТИЛИ (Окно стало меньше по вертикали) ---

const inputCardStyle = {
    position: 'fixed',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#1a1a1a',
    padding: '25px 35px', // Уменьшили вертикальный отступ с 40px до 25px
    borderRadius: '24px',
    border: '2px solid #ffcc00',
    textAlign: 'center',
    minWidth: '300px',
    zIndex: 10000,
    boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backfaceVisibility: 'hidden'
};

const headerStyle = { 
    color: 'white', 
    marginBottom: '15px', // Уменьшили отступ снизу с 25px до 15px
    letterSpacing: '3px', 
    fontSize: '18px', 
    fontWeight: 'bold' 
};

const inputWrapper = { 
    position: 'relative', 
    width: '100%', 
    marginBottom: '20px' // Уменьшили отступ снизу с 35px до 20px
};

const inputFieldStyle = { 
    padding: '12px', // Немного уменьшили внутренний отступ инпута
    width: '100%', 
    borderRadius: '10px', 
    border: '1px solid #444', 
    backgroundColor: '#000', 
    color: '#fff', 
    fontSize: '18px', 
    textAlign: 'center', 
    outline: 'none', 
    boxSizing: 'border-box' 
};

const submitBtnStyle = { 
    padding: '12px 40px', // Уменьшили высоту кнопки
    background: 'linear-gradient(45deg, #ffcc00, #ff9900)', 
    border: 'none', 
    borderRadius: '30px', 
    fontWeight: '900', 
    fontSize: '14px', 
    color: '#000', 
    boxShadow: '0 5px 20px rgba(255, 204, 0, 0.3)',
    transition: 'all 0.2s ease'
};

export default NameInput;