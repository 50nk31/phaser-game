import { Game as MainGame } from './scenes/Game';
import { AUTO, Scale, Game } from 'phaser';

const config = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        // RESIZE позволяет игре занимать всё место внутри div, который мы настроим в CSS
        mode: Scale.RESIZE, 
        width: '100%',
        height: '100%',
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [MainGame]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

// ОБЯЗАТЕЛЬНО: этот экспорт должен быть здесь
export default StartGame;
