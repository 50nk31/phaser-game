import React, { useState, useEffect, useRef } from 'react';

const SettingsPanel = ({ settings, setSettings, onClose }) => {
    const [tempSettings, setTempSettings] = useState({ ...settings });
    const [previewText, setPreviewText] = useState("");
    const timerRef = useRef(null);

    const fullText = "Так будет выглядеть текст в вашей игре.";

    // Функция запуска анимации текста
    const startPreview = (currentSpeed) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setPreviewText("");
        let i = 0;
        
        timerRef.current = setInterval(() => {
            i++;
            setPreviewText(fullText.substring(0, i));
            if (i >= fullText.length) {
                clearInterval(timerRef.current);
            }
        }, currentSpeed);
    };

    // Запускаем печать только при изменении настроек
    useEffect(() => {
        startPreview(tempSettings.textSpeed);
        return () => clearInterval(timerRef.current);
    }, [tempSettings.textSpeed, tempSettings.fontSize]); 

    const handleApply = (e) => {
        e.stopPropagation();
        setSettings(tempSettings);
        onClose();
    };

    return (
        <div style={overlayStyle} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
            <div style={windowStyle}>
                <div style={headerStyle}>НАСТРОЙКИ</div>
                
                <div style={contentStyle}>
                    {/* Блок превью */}
                    <div style={previewContainer}>
                        <div style={previewLabel}>ПРЕДПРОСМОТР (ПРИ ИЗМЕНЕНИИ):</div>
                        <div style={{
                            ...previewBox,
                            fontSize: `${tempSettings.fontSize}px`,
                            minHeight: `60px`, // Фиксированная высота, чтобы окно не дергалось
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {previewText}
                        </div>
                    </div>

                    <hr style={divider} />

                    <div style={itemStyle}>
                        <div style={rowStyle}>
                            <label style={labelStyle}>Скорость текста</label>
                            <span style={valueStyle}>{tempSettings.textSpeed} мс</span>
                        </div>
                        <input 
                            style={rangeStyle}
                            type="range" min="5" max="100" 
                            value={tempSettings.textSpeed}
                            onChange={(e) => setTempSettings({...tempSettings, textSpeed: parseInt(e.target.value)})}
                        />
                    </div>

                    <div style={itemStyle}>
                        <div style={rowStyle}>
                            <label style={labelStyle}>Размер шрифта</label>
                            <span style={valueStyle}>{tempSettings.fontSize} px</span>
                        </div>
                        <input 
                            style={rangeStyle}
                            type="range" min="14" max="30" 
                            value={tempSettings.fontSize}
                            onChange={(e) => setTempSettings({...tempSettings, fontSize: parseInt(e.target.value)})}
                        />
                    </div>
                </div>

                <button style={applyBtn} onClick={handleApply}>ПРИМЕНИТЬ</button>
            </div>
        </div>
    );
};

// Стили
const overlayStyle = { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
const windowStyle = { backgroundColor: '#1a1a1a', color: 'white', width: '320px', borderRadius: '12px', display: 'flex', flexDirection: 'column', border: '1px solid #444', overflow: 'hidden' };
const headerStyle = { padding: '15px', borderBottom: '1px solid #333', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' };
const contentStyle = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' };

const previewContainer = { display: 'flex', flexDirection: 'column', gap: '8px' };
const previewLabel = { fontSize: '10px', color: '#888', fontWeight: 'bold' };
const previewBox = { 
    backgroundColor: '#000', 
    padding: '15px', 
    borderRadius: '8px', 
    color: '#fff', 
    lineHeight: '1.4',
    border: '1px solid #333'
};

const divider = { border: 'none', borderTop: '1px solid #333', margin: '0' };
const itemStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const labelStyle = { fontSize: '13px', color: '#ccc' };
const valueStyle = { fontSize: '12px', color: '#028af8', fontWeight: 'bold' };
const rangeStyle = { cursor: 'pointer', accentColor: '#028af8' };
const applyBtn = { padding: '18px', background: '#028af8', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };

export default SettingsPanel;