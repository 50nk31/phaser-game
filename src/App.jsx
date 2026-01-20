import { useRef, useEffect, useState } from 'react';
import { PhaserGame } from './PhaserGame';

function App() {
    const phaserRef = useRef();
    const [canShowGame, setCanShowGame] = useState(true);

    // Принудительный рефреш при изменении ориентации
    useEffect(() => {
        const handleOrientationChange = () => {
            // Перезагружаем игру при смене ориентации для лучшей совместимости
            setCanShowGame(false);
            
            setTimeout(() => {
                setCanShowGame(true);
            }, 50);
        };

        // Ориентация
        window.addEventListener('orientationchange', handleOrientationChange);
        
        // Предотвращаем масштабирование на мобильных
        const preventZoom = (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };
        
        document.addEventListener('touchmove', preventZoom, { passive: false });
        
        // Предотвращаем контекстное меню
        document.addEventListener('contextmenu', (e) => e.preventDefault());

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            document.removeEventListener('touchmove', preventZoom);
            document.removeEventListener('contextmenu', (e) => e.preventDefault());
        };
    }, []);

    // Функция для обработки готовности сцены
    const handleSceneReady = (scene) => {
        console.log('Scene is ready:', scene);
        // Здесь можно добавить логику инициализации
    };

    // Стили для приложения
    const appStyle = {
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#028af8'
    };

    return (
        <div id="app" style={appStyle}>
            {canShowGame && (
                <PhaserGame 
                    ref={phaserRef} 
                    currentActiveScene={handleSceneReady}
                />
            )}
        </div>
    );
}

export default App;
