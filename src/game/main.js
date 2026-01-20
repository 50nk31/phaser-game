import { Game as MainGame } from './scenes/Game';
import { AUTO, Scale, Game } from 'phaser';

// Выбираем размеры, ориентированные на мобильные устройства (9:16)
const DESIGN_WIDTH = 360;
const DESIGN_HEIGHT = 640;

const config = {
    type: AUTO,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [MainGame],
    scale: {
        mode: Scale.RESIZE, // Автоматически подстраивает размер под контейнер
        autoCenter: Scale.CENTER_BOTH,
        expandParent: false,
        // Для мобильных лучше использовать RESIZE или FIT
        // FIT - вписывает в экран с сохранением пропорций
        // RESIZE - меняет размер под размер контейнера
        // Дополнительные настройки:
        // width: '100%',
        // height: '100%',
        // min: {
        //     width: DESIGN_WIDTH * 0.5,
        //     height: DESIGN_HEIGHT * 0.5
        // },
        // max: {
        //     width: DESIGN_WIDTH * 2,
        //     height: DESIGN_HEIGHT * 2
        // }
    },
    // Добавляем настройки для мобильных
    input: {
        touch: {
            capture: true
        }
    }
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;
