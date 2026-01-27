import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Greeting extends Scene {
    constructor() {
        super('Greeting');
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('bg_door', 'bg_door.png');
        this.load.image('bg_office', 'bg_office.png');
        this.load.image('bg_magic_office', 'bg_magic_office.png');
        this.load.image('kotik_normal', 'kotik_normal.png');
        this.load.image('kotik_wizard', 'kotik_wizard.png');
    }

    create() {
        this.bg = this.add.image(0, 0, 'bg_door').setOrigin(0.5, 0.5);
        this.kotik = this.add.image(0, 0, 'kotik_normal').setOrigin(0.5, 1).setVisible(false);
        
        this.blackOverlay = this.add.rectangle(0, 0, 4000, 4000, 0x000000).setAlpha(0).setDepth(90);

        this.finalText = this.add.text(0, 0, 'Создание персонажа в разработке', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 300 }
        }).setOrigin(0.5).setAlpha(0).setDepth(100);

        this.resize();
        this.scale.on('resize', this.resize, this);

        EventBus.on('update-visuals', (data) => {
            // Если мы НЕ в конце (нажали назад), сбрасываем финал
            if (!data.end) {
                this.tweens.killAll();
                this.blackOverlay.setAlpha(0);
                this.finalText.setAlpha(0);
                this.kotik.setAlpha(1);
            }

            // Обновление фона
            if (data.bg) {
                this.bg.setTexture(data.bg);
            }

            // ИСПРАВЛЕНИЕ: Обновление персонажа
            if (data.character) {
                this.kotik.setTexture(data.character).setVisible(true);
            } else {
                // Если в данных шага НЕТ персонажа (как на шаге с дверью), прячем его
                this.kotik.setVisible(false);
            }

            if (data.flash) {
                this.cameras.main.flash(600, 255, 255, 255);
            }
            
            if (data.end) {
                this.startFinalTransition();
            } else {
                this.resize();
            }
        });

        EventBus.emit('current-scene-ready', this);
    }

    startFinalTransition() {
        this.tweens.add({ targets: this.kotik, alpha: 0, duration: 800 });
        this.tweens.add({
            targets: this.blackOverlay,
            alpha: 1,
            duration: 1500,
            onComplete: () => {
                this.tweens.add({ targets: this.finalText, alpha: 1, duration: 1000 });
            }
        });
    }

    resize() {
        const width = this.scale.width;
        const height = this.scale.height;
        this.cameras.main.setScroll(0, 0);

        if (this.bg) {
            this.bg.setPosition(width / 2, height / 2);
            const scale = Math.max(width / this.bg.width, height / this.bg.height);
            this.bg.setScale(scale);
        }

        if (this.kotik) {
            // Твой оригинальный размер кота
            this.kotik.setPosition(width / 2, height - 150); 
            const targetHeightRatio = 0.5; 
            let kScale = (height * targetHeightRatio) / this.kotik.frame.height;
            if (this.kotik.frame.width * kScale > width * 0.9) {
                kScale = (width * 0.9) / this.kotik.frame.width;
            }
            this.kotik.setScale(kScale);
        }

        this.blackOverlay.setPosition(width / 2, height / 2);
        this.finalText.setPosition(width / 2, height / 2);
        this.finalText.setWordWrapWidth(width * 0.8);
    }
}