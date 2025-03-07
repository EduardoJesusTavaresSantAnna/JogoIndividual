export default class tutorial extends Phaser.Scene {
    constructor() {
        super('tutorial');
    }

    create() {
        
        this.add.image(1278/2, 551/2, 'bgTutorial')
        this.input.keyboard.on('keydown', () => {
            this.scene.start('menu'); // Reinicie a cena fase1 ao pressionar uma tecla
        });
    }
}