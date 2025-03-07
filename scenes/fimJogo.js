// Objetivo: Criar a cena de fim de jogo
export default class fimJogo extends Phaser.Scene {
    constructor() {
        super('fimJogo');
    }

    create() {
        
        // Adiciona a imagem de fundo
        this.add.image(1278/2, 551/2, 'bgFimJogo')
        this.input.keyboard.on('keydown', () => {
            this.scene.start('menu'); // Reinicie a cena fase1 ao pressionar uma tecla
        });
    }
}