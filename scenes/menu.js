export default class menu extends Phaser.Scene{
    constructor(){
        // Configura a chave de classe
        super('menu');
    };

    preload(){

        //realizando preload das imagens usadas nessa e em todas as paginas seguintes.
        
        this.load.image('Jogar', 'assets/botãoJogar.png');
        this.load.image('Tutorial', 'assets/botãoTutorial.png');
        this.load.image('bgMenu', 'assets/background.png');
        this.load.image("bgFase1", "assets/background1.jpg");
         this.load.image("bgFimJogo", "assets/bgGameOver.png" );
        this.load.image("bgVitoria", "assets/bgVitoria.png" );
        this.load.image("bgTutorial", 'assets/bgTutorial.png');
        this.load.spritesheet('player', "assets/Player.png", {frameWidth: 40, frameHeight: 80});
        this.load.spritesheet('oponente', "assets/oponente.png", {frameWidth: 40, frameHeight: 80});
        this.load.image("plataforma", "assets/grama1.png");
        this.load.image("bola", "assets/bola.png");
        this.load.image("trave", "assets/trave.png");
    };

    create() {
        // Criar a cena de menu
        this.bgMenu = this.add.image(1278/2, 551/2, 'bgMenu').setScale(1); //criando backgorund do menu
        const botaoStart = this.add.image(1228/2, 551/2, 'Jogar').setInteractive({cursor: "pointer"}).setScale(0.6);
        const botaoTutorial = this.add.image(1228/2, 400, 'Tutorial').setInteractive({cursor: "pointer"}).setScale(0.6);

        // Adiciona um evento de clique ao botão
        botaoStart.on("pointerdown", () => {
            this.scene.start('fase1')
            this.scene.stop('Menu')
        });

        botaoTutorial.on("pointerdown", () => {
            this.scene.start('tutorial')
            this.scene.stop('Menu')
        });
    }
};
