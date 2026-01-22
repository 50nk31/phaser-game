import React, { useEffect, useRef } from 'react';

const HistoryPanel = ({ history, onClose }) => {
    const scrollRef = useRef(null);

    // Автоматический скролл вниз при открытии
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    return (
        /* Остановка всплытия клика на фоне, чтобы не срабатывал переход диалога */
        <div style={overlayStyle} onPointerDown={(e) => e.stopPropagation()} onClick={onClose}>
            <div style={windowStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>ИСТОРИЯ ДИАЛОГОВ</div>
                
                <div ref={scrollRef} style={contentStyle}>
                    {history.map((item, i) => (
                        <div key={i} style={{ 
                            marginBottom: '15px', 
                            textAlign: item.isChoice ? 'right' : 'left' 
                        }}>
                            {item.name && (
                                <div style={{ color: '#ffcc00', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}>
                                    {item.name}
                                </div>
                            )}
                            <div style={{ 
                                display: 'inline-block',
                                padding: item.isChoice ? '8px 12px' : '0',
                                backgroundColor: item.isChoice ? '#028af8' : 'transparent',
                                borderRadius: '8px',
                                fontSize: '15px',
                                lineHeight: '1.4'
                            }}>
                                {item.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Добавляем e.stopPropagation() и на саму кнопку для надежности */}
                <button 
                    style={closeBtn} 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onClose();
                    }}
                >
                    ЗАКРЫТЬ
                </button>
            </div>
        </div>
    );
};

const overlayStyle = { 
    position: 'absolute', 
    inset: 0, 
    backgroundColor: 'rgba(0,0,0,0.85)', 
    zIndex: 2000, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
};

const windowStyle = { 
    backgroundColor: '#1a1a1a', 
    color: 'white', 
    width: '90%', 
    maxHeight: '80vh', 
    borderRadius: '12px', 
    display: 'flex', 
    flexDirection: 'column', 
    border: '1px solid #444',
    overflow: 'hidden'
};

const headerStyle = { 
    padding: '15px', 
    borderBottom: '1px solid #333', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: '14px',
    letterSpacing: '1px'
};

const contentStyle = { 
    flex: 1, 
    overflowY: 'auto', 
    padding: '20px' 
};

const closeBtn = { 
    padding: '15px', 
    background: '#333', 
    color: 'white', 
    border: 'none', 
    cursor: 'pointer', 
    fontWeight: 'bold',
    fontSize: '14px'
};

export default HistoryPanel;