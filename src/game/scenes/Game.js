import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene {
    constructor() { super('Game'); }

    preload() {
        this.load.setPath('assets');
        this.load.image('bg_door', 'bg_door.png');
        this.load.image('bg_office', 'bg_office.png');
        this.load.image('bg_magic_office', 'bg_magic_office.png');
        this.load.image('kotik_normal', 'kotik_normal.png');
        this.load.image('kotik_wizard', 'kotik_wizard.png');
    }

    create() {
        const { width, height } = this.scale;
        this.bg = this.add.image(width / 2, height / 2, 'bg_door');
        this.kotik = this.add.image(width / 2, height, 'kotik_normal').setOrigin(0.5, 1).setVisible(false);

        this.resize();

        EventBus.on('update-visuals', (data) => {
            if (data.bg) this.bg.setTexture(data.bg);
            if (data.character) this.kotik.setTexture(data.character).setVisible(true);
            if (data.flash) this.cameras.main.flash(600, 255, 255, 255);
            this.resize();
        });

        this.scale.on('resize', this.resize, this);
        EventBus.emit('current-scene-ready', this);
    }

    resize() {
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height / 2;

        if (this.bg) {
            this.bg.setPosition(centerX, centerY);
            let bgScale = Math.max(width / this.bg.width, height / this.bg.height);
            this.bg.setScale(bgScale);
        }

        if (this.kotik) {
            // Поднимаем котика на 40 пикселей выше от нижнего края экрана
            this.kotik.setPosition(centerX, height - 40); 
            // Масштаб: кот занимает 50% высоты экрана
            let kScale = (height / this.kotik.height) * 0.5; 
            this.kotik.setScale(kScale);
        }
    }
}
