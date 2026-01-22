import { Game as MainGame } from './scenes/Game';
import { AUTO, Scale, Game } from 'phaser';

const config = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        // RESIZE: Игра будет менять свои внутренние размеры (width/height)
        // в зависимости от реального размера окна браузера
        mode: Scale.RESIZE,
        width: '100%',
        height: '100%',
        autoCenter: Scale.NO_CENTER // Центрирование не нужно, мы и так на весь экран
    },
    // Убираем пикселизацию для четкости при масштабировании
    render: {
        antialias: true,
        pixelArt: false
    },
    scene: [MainGame]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;