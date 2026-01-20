import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './game/main';
import { EventBus } from './game/EventBus';

export const PhaserGame = forwardRef(function PhaserGame ({ currentActiveScene }, ref)
{
    const game = useRef();
    const [isPortrait, setIsPortrait] = useState(true);

    // Функция для определения ориентации
    const checkOrientation = () => {
        const portrait = window.innerHeight > window.innerWidth;
        setIsPortrait(portrait);
        return portrait;
    };

    // Функция для обработки изменения размера
    const handleResize = () => {
        if (game.current && game.current.scale) {
            const isPortraitMode = checkOrientation();
            
            // Обновляем размеры игры
            game.current.scale.refresh();
            
            // Даем время на перерисовку
            setTimeout(() => {
                if (game.current && game.current.scale) {
                    game.current.scale.refresh();
                    
                    // Эмитируем событие для сцены
                    EventBus.emit('resize', {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        isPortrait: isPortraitMode
                    });
                }
            }, 100);
        }
    };

    // Создаем игру
    useLayoutEffect(() => {
        
        if (game.current === undefined)
        {
            game.current = StartGame("game-container");
            
            // Инициализируем ориентацию
            checkOrientation();
            
            // Добавляем обработчики событий
            window.addEventListener('resize', handleResize);
            window.addEventListener('orientationchange', handleResize);
            
            if (ref !== null)
            {
                ref.current = { 
                    game: game.current, 
                    scene: null,
                    isPortrait: isPortrait
                };
            }
        }

        return () => {
            // Удаляем обработчики событий
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            
            if (game.current)
            {
                game.current.destroy(true);
                game.current = undefined;
            }
        }
    }, [ref]);

    // Обработка готовности сцены
    useEffect(() => {

        EventBus.on('current-scene-ready', (currentScene) => {

            if (currentActiveScene instanceof Function)
            {
                currentActiveScene(currentScene);
            }
            
            if (ref !== null)
            {
                ref.current.scene = currentScene;
                ref.current.isPortrait = isPortrait;
            }
            
        });

        // Подписываемся на событие ресайза для обновления ref
        EventBus.on('resize', (data) => {
            if (ref !== null && ref.current)
            {
                ref.current.isPortrait = data.isPortrait;
            }
        });

        return () => {
            EventBus.removeListener('current-scene-ready');
            EventBus.removeListener('resize');
        }
        
    }, [currentActiveScene, ref, isPortrait]);

    // CSS стили для контейнера
    const containerStyle = {
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#028af8', // Фон на случай, если игра не загрузилась
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
    };

    return (
        <div id="game-container" style={containerStyle}></div>
    );
});
