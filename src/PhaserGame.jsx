import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './game/main'; // Здесь StartGame импортируется как default
import { EventBus } from './game/EventBus';

export const PhaserGame = forwardRef(function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef();

    // Стили контейнера: на мобильных — весь экран, на ПК — ограничение
    const containerStyle = {
        width: '100%',
        height: '100%',
        maxWidth: '600px', // Ограничиваем ширину на ПК
        maxHeight: '100vh',
        margin: '0 auto',
        display: 'block'
    };

    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame("game-container");

            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        }
    }, [ref]);

    useEffect(() => {
        EventBus.on('current-scene-ready', (currentScene) => {
            if (currentActiveScene instanceof Function) {
                currentActiveScene(currentScene);
            }
            if (ref.current) {
                ref.current.scene = currentScene;
            }
        });

        return () => {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, ref]);

    return (
        /* Внешний оберточный блок делает черный фон для "полос" по бокам на ПК */
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', display: 'flex', justifyContent: 'center' }}>
            <div id="game-container" style={containerStyle}></div>
        </div>
    );
});
