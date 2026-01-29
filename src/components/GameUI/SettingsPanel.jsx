import React, { useState, useEffect, useRef } from 'react';

const SettingsPanel = ({ settings, setSettings, onClose, playerName, playerClass, onChangeName, onChangeClass }) => {
    const [speedStep, setSpeedStep] = useState(11 - Math.round(settings.textSpeed / 10));
    const [tempSettings, setTempSettings] = useState({ ...settings });
    const [previewText, setPreviewText] = useState("");
    const timerRef = useRef(null);

    const fullText = "Так будет выглядеть текст.";
    
    const startPreview = (currentDelay) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setPreviewText("");
        let i = 0;
        timerRef.current = setInterval(() => {
            i++;
            setPreviewText(fullText.substring(0, i));
            if (i >= fullText.length) clearInterval(timerRef.current);
        }, currentDelay);
    };

    useEffect(() => {
        startPreview(tempSettings.textSpeed);
        return () => clearInterval(timerRef.current);
    }, [tempSettings.textSpeed, tempSettings.fontSize]);

    const handleSpeedSlider = (e) => {
        const step = parseInt(e.target.value);
        setSpeedStep(step);
        const newDelay = (11 - step) * 10; 
        setTempSettings({ ...tempSettings, textSpeed: newDelay });
    };

    const handleApply = (e) => {
        e.stopPropagation();
        if (typeof setSettings === 'function') {
            setSettings(tempSettings);
        }
        onClose();
    };

    const showCharacterSection = !!(playerName || playerClass);

    return (
        <div style={overlayStyle} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
            <div style={windowStyle}>
                <div style={headerStyle}>НАСТРОЙКИ</div>
                
                <div style={contentStyle}>
                    <div style={previewContainer}>
                        <div style={previewLabel}>ПРЕДПРОСМОТР:</div>
                        <div style={{
                            ...previewBox,
                            fontSize: `${tempSettings.fontSize}px`,
                            minHeight: '50px',
                        }}>
                            {previewText}
                        </div>
                    </div>

                    <hr style={divider} />

                    <div style={itemStyle}>
                        <label style={labelStyle}>Скорость текста</label>
                        <input 
                            style={rangeStyle}
                            type="range" min="1" max="10" step="1"
                            value={speedStep}
                            onChange={handleSpeedSlider}
                        />
                    </div>

                    <div style={itemStyle}>
                        <label style={labelStyle}>Размер шрифта</label>
                        <input 
                            style={rangeStyle}
                            type="range" min="14" max="30" 
                            value={tempSettings.fontSize}
                            onChange={(e) => setTempSettings({...tempSettings, fontSize: parseInt(e.target.value)})}
                        />
                    </div>

                    {showCharacterSection && (
                        <>
                            <hr style={divider} />
                            <div style={itemStyle}>
                                <label style={previewLabel}>ПЕРСОНАЖ</label>
                                
                                <div style={infoAreaStyle}>
                                    {playerName && (
                                        <div style={infoLine}>Имя: <span style={infoValue}>{playerName}</span></div>
                                    )}
                                    {playerClass && (
                                        <div style={infoLine}>Профессия: <span style={infoValue}>{playerClass.name}</span></div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '5px' }}>
                                    {playerName && (
                                        <button style={changeNameBtn} onClick={onChangeName}>ИЗМЕНИТЬ ИМЯ</button>
                                    )}
                                    {onChangeClass && (
                                        <button style={changeClassBtn} onClick={onChangeClass}>СМЕНИТЬ ПРОФЕССИЮ</button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <button style={applyBtn} onClick={handleApply}>ПРИМЕНИТЬ</button>
            </div>
        </div>
    );
};

const FONT_STACK = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const overlayStyle = { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'auto', fontFamily: FONT_STACK };
const windowStyle = { backgroundColor: '#1a1a1a', color: 'white', width: '310px', borderRadius: '12px', display: 'flex', flexDirection: 'column', border: '1px solid #333', overflow: 'hidden' };
const headerStyle = { padding: '15px', borderBottom: '1px solid #333', textAlign: 'center', fontWeight: '600', fontSize: '14px', letterSpacing: '0.5px' };
const contentStyle = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' };
const previewContainer = { display: 'flex', flexDirection: 'column', gap: '6px' };
const previewLabel = { fontSize: '10px', color: '#666', fontWeight: '700', letterSpacing: '0.5px' };
const previewBox = { backgroundColor: '#000', padding: '12px', borderRadius: '8px', color: '#fff', lineHeight: '1.4', border: '1px solid #222', display: 'flex', alignItems: 'center' };
const divider = { border: 'none', borderTop: '1px solid #333', margin: '0' };

const itemStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '14px', color: '#ccc', fontWeight: '500' }; 
const rangeStyle = { cursor: 'pointer', accentColor: '#028af8', width: '100%' };

const infoAreaStyle = { padding: '2px 0', display: 'flex', flexDirection: 'column', gap: '4px' };
const infoLine = { fontSize: '14px', color: '#999' }; 
const infoValue = { color: '#fff', fontWeight: '600' };

const applyBtn = { padding: '15px', background: '#028af8', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', pointerEvents: 'auto' };
const changeNameBtn = { padding: '8px', background: '#2a2a2a', color: '#ffcc00', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', pointerEvents: 'auto' };
const changeClassBtn = { ...changeNameBtn, color: '#028af8' };

export default SettingsPanel;