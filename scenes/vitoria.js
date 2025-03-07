// Objetivo: Criar a cena da vitória.
export default class vitoria extends Phaser.Scene {
    constructor() {
        super('vitoria');
    }

    create() {
        
        //A cena da vitória deve ter uma imagem de fundo que cubra a tela inteira.
        this.add.image(1278/2, 551/2, 'bgVitoria')
        this.input.keyboard.on('keydown', () => {
            this.scene.start('menu'); // Reinicie a cena fase1 ao pressionar uma tecla
        });
    }
}