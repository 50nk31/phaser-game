import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene {
    constructor() {
        super('Game');
        // Базовые размеры дизайна (9:16 - портретная ориентация)
        this.DESIGN_WIDTH = 360;
        this.DESIGN_HEIGHT = 640;
        this.scaleFactor = 1;
        this.currentWidth = this.DESIGN_WIDTH;
        this.currentHeight = this.DESIGN_HEIGHT;
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('star', 'star.png');
        this.load.image('background', 'bg.png');
        this.load.image('logo', 'logo.png');
    }

    create() {
        // Инициализируем масштабирование
        this.initScaling();
        
        // Добавляем игровые объекты
        this.createGameObjects();
        
        // Настраиваем ресайз
        this.setupResizeHandler();
        
        EventBus.emit('current-scene-ready', this);
    }

    initScaling() {
        const canvas = this.sys.game.canvas;
        const parent = canvas.parentElement;
        
        if (parent) {
            this.currentWidth = parent.clientWidth;
            this.currentHeight = parent.clientHeight;
        }
        
        // Рассчитываем масштаб
        this.scaleFactor = Math.min(
            this.currentWidth / this.DESIGN_WIDTH,
            this.currentHeight / this.DESIGN_HEIGHT
        );
        
        // Настраиваем камеру
        this.cameras.main.setViewport(
            (this.currentWidth - this.DESIGN_WIDTH * this.scaleFactor) / 2,
            (this.currentHeight - this.DESIGN_HEIGHT * this.scaleFactor) / 2,
            this.DESIGN_WIDTH * this.scaleFactor,
            this.DESIGN_HEIGHT * this.scaleFactor
        );
        
        this.cameras.main.setZoom(this.scaleFactor);
    }

    createGameObjects() {
        // Все координаты указываем относительно DESIGN_WIDTH и DESIGN_HEIGHT
        // Они будут автоматически масштабироваться
        
        // Фон
        const bg = this.add.image(this.DESIGN_WIDTH / 2, this.DESIGN_HEIGHT / 2, 'background');
        bg.setDisplaySize(this.DESIGN_WIDTH, this.DESIGN_HEIGHT);
        
        // Логотип
        const logo = this.add.image(this.DESIGN_WIDTH / 2, this.DESIGN_HEIGHT / 2 - 100, 'logo');
        logo.setScale(0.5 * this.scaleFactor);
        logo.setDepth(100);
        
        // Текст
        const text = this.add.text(
            this.DESIGN_WIDTH / 2, 
            this.DESIGN_HEIGHT - 150, 
            'Make something fun!\nand share it with us:\nsupport@phaser.io', 
            {
                fontFamily: 'Arial Black',
                fontSize: 20,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            }
        );
        text.setOrigin(0.5);
        text.setDepth(100);
        
        // Масштабируем текст
        text.setScale(this.scaleFactor);
        
        // Пример интерактивного элемента
        const star = this.add.image(this.DESIGN_WIDTH / 2, this.DESIGN_HEIGHT - 50, 'star');
        star.setInteractive({ useHandCursor: true });
        star.setScale(0.8 * this.scaleFactor);
        
        star.on('pointerdown', () => {
            this.tweens.add({
                targets: star,
                scale: star.scale * 1.2,
                duration: 100,
                yoyo: true
            });
        });
    }

    setupResizeHandler() {
        // Обработчик изменения размера окна
        this.scale.on('resize', (gameSize) => {
            this.handleResize(gameSize);
        });
        
        // Обработчик кастомного события resize
        EventBus.on('resize', (data) => {
            this.handleResize({
                width: data.width,
                height: data.height
            });
        });
    }

    handleResize(gameSize) {
        // Обновляем текущие размеры
        this.currentWidth = gameSize.width;
        this.currentHeight = gameSize.height;
        
        // Пересчитываем масштаб
        this.scaleFactor = Math.min(
            this.currentWidth / this.DESIGN_WIDTH,
            this.currentHeight / this.DESIGN_HEIGHT
        );
        
        // Обновляем вьюпорт камеры
        this.cameras.main.setViewport(
            (this.currentWidth - this.DESIGN_WIDTH * this.scaleFactor) / 2,
            (this.currentHeight - this.DESIGN_HEIGHT * this.scaleFactor) / 2,
            this.DESIGN_WIDTH * this.scaleFactor,
            this.DESIGN_HEIGHT * this.scaleFactor
        );
        
        // Обновляем зум
        this.cameras.main.setZoom(this.scaleFactor);
        
        // Центрируем камеру
        this.cameras.main.centerOn(this.DESIGN_WIDTH / 2, this.DESIGN_HEIGHT / 2);
        
        // Опционально: можно обновить позиции некоторых объектов
        // this.updateGameObjects();
    }

    updateGameObjects() {
        // Если нужно обновлять позиции объектов при ресайзе
        // Например, для адаптивного UI
        const children = this.children.getChildren();
        children.forEach(child => {
            if (child.type === 'Text') {
                child.setScale(this.scaleFactor);
            }
        });
    }
}
