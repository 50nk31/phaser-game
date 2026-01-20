import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // Убедитесь, что пути к ассетам верные
        this.load.setPath('assets');
        this.load.image('star', 'star.png');
        this.load.image('background', 'bg.png');
        this.load.image('logo', 'logo.png');
    }

    create() {
        // 1. Создаем элементы один раз
        this.createGameObjects();

        // 2. Слушаем событие изменения размера экрана (например, поворот телефона)
        this.scale.on('resize', this.resize, this);

        // 3. Сразу вызываем resize, чтобы всё встало на свои места
        this.resize();

        // Сообщаем React, что сцена готова
        EventBus.emit('current-scene-ready', this);
    }

    createGameObjects() {
        // Создаем фон (без позиции, её задаст resize)
        this.bg = this.add.image(0, 0, 'background');

        // Создаем логотип
        this.logo = this.add.image(0, 0, 'logo').setDepth(100);

        // Создаем текст
        this.uiText = this.add.text(0, 0, 'Telegram Web App\nGame', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Создаем группу для звезд
        this.stars = this.add.group();
        for (let i = 0; i < 15; i++) {
            const star = this.add.image(0, 0, 'star').setInteractive({ useHandCursor: true });
            
            star.on('pointerdown', () => {
                this.tweens.add({
                    targets: star,
                    scale: star.scale * 1.5,
                    duration: 200,
                    yoyo: true,
                    ease: 'Back.easeOut'
                });
            });
            this.stars.add(star);
        }
    }

    // Эта функция отвечает за расстановку объектов при любом размере экрана
    resize() {
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height / 2;

        // --- 1. Адаптация фона (Эффект Cover) ---
        this.bg.setPosition(centerX, centerY);
        const scaleX = width / this.bg.width;
        const scaleY = height / this.bg.height;
        const maxScale = Math.max(scaleX, scaleY);
        this.bg.setScale(maxScale);

        // --- 2. Позиционирование лого и текста ---
        this.logo.setPosition(centerX, centerY - 100);
        // Масштабируем лого, чтобы оно не было огромным на планшетах
        const logoScale = Math.min(width / 800, 1); 
        this.logo.setScale(logoScale);

        this.uiText.setPosition(centerX, height - 150);
        this.uiText.setFontSize(Math.max(24, 38 * logoScale));

        // --- 3. Раскидываем звезды по экрану ---
        this.stars.getChildren().forEach((star) => {
            // Если звезда еще не имеет позиции, даем ей случайную
            if (star.x === 0) {
                star.setPosition(
                    Phaser.Math.Between(50, width - 50),
                    Phaser.Math.Between(50, height - 50)
                );
            } else {
                // Если экран изменился, просто сдвигаем их пропорционально (опционально)
                // Для простоты здесь просто оставим как есть или перегенерируем
            }
        });
    }
}
