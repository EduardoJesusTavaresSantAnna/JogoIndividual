// Defina a classe Plataforma antes da classe fase1
class Plataforma {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.sprite = scene.physics.add.staticSprite(x, y, texture); // Usar staticSprite para plataformas
        this.sprite.body.setSize(167, 28); // width e height são as dimensões desejadas
    }
}
// Defina a classe Oponente com animação
class Oponente {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setScale(0.5);
        this.sprite.setSize(40, 65)
        this.sprite.body.setCollideWorldBounds(true); // Colisão com os limites do mundo

        // Adicionar animação para movimento
        scene.anims.create({
            key: 'oponenteMove',
            frames: scene.anims.generateFrameNumbers(texture, { start: 8, end: 12 }), // Ajuste os índices conforme seu spritesheet
            frameRate: 10,
            repeat: -1
        });

        // Adicionar animação para idle
        scene.anims.create({
            key: 'oponenteIdle',
            frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: 7 }), // Apenas um frame de idle
            frameRate: 1,
            repeat: -1
        });

        // Inicialmente, o oponente fica em idle
        this.sprite.anims.play('oponenteIdle', true);
    }

    // Método para mover o oponente e tocar a animação de movimento
    mover(direcao) {
        if (direcao === 'direita') {
            this.sprite.setVelocityX(50);
            this.sprite.flipX = true;
        } else if (direcao === 'esquerda') {
            this.sprite.setVelocityX(-50);
            this.sprite.flipX = false;
        }
        this.sprite.anims.play('oponenteMove', true); // Tocar animação de movimento
    }

    // Método para parar o oponente e tocar a animação de idle
    parar() {
        this.sprite.setVelocityX(0);
        this.sprite.anims.play('oponenteIdle', true); // Tocar animação de idle
    }

}

export default class fase1 extends Phaser.Scene {
    constructor() {
        // Configura a chave de classe
        super('fase1');
        this.oponentes = []; // Lista de oponentes
    }

    create() {

        // Adicionar o background
        this.add.image(1278 / 2, 551 / 2, "bgFase1");

        // Adicionar o jogador
        this.player = this.physics.add.sprite(20, 490, 'player').setScale(0.5);
        this.player.body.setSize(40, 65);
        this.player.setCollideWorldBounds(true); // Faz o jogador colidir com os limites da cena

        // Adicionar a bola e definir colisão com os limites do mundo
        this.bola = this.physics.add.sprite(40, 490, 'bola').setScale(0.1);
        this.bola.body.setSize(100, 100);
        this.bola.body.setCollideWorldBounds(true); // Adicionar colisão com os limites do mundo

        // Adicionar teclado
        this.teclado = this.input.keyboard.createCursorKeys();

        // Adicionar a trave e definir colisão com os limites do mundo
        this.trave = this.physics.add.sprite(1250, 330, 'trave').setScale(0.6);
        this.trave.setCollideWorldBounds(true);

        // Adicionar limites da câmera
        this.cameras.main.setBounds(0, 0, 1278, 551);
        

        // Criação da animação para movimento
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 15 }), // Ajuste os índices conforme seu spritesheet
            frameRate: 12,
            repeat: -1 // Repetição contínua enquanto a tecla estiver 
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }), // Apenas um frame de idle
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'salto',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 19 }),
            frameRate: 4,
            repeat: 1
        });

        this.anims.create({
            key: 'queda',
            frames: this.anims.generateFrameNumbers('player', { start: 24, end: 27 }),
            frameRate: 4,
            repeat: 1
        });

        // Definir a altura do jogo
        this.alturaJogo = this.sys.game.config.height;

        // Criação das plataformas usando um laço for e let
        this.plataformas = this.physics.add.staticGroup();
        let plataformaX = 85;
        let plataformaY = 530;
        let quantidadePlataformas = 10; // número de plataformas a serem criadas

        for (let i = 0; i < quantidadePlataformas; i++) {
            this.plataformas.add(new Plataforma(this, plataformaX, plataformaY, 'plataforma').sprite);
            plataformaX += 167; // espaçamento entre plataformas
            plataformaY += 0; // espaçamento entre plataformas
        }

        // Adicionar colisão entre o jogador e as plataformas
        this.physics.add.collider(this.player, this.plataformas);
        this.physics.add.collider(this.bola, this.plataformas);

        // Adicionar variável bolaPega
        this.bolaPega = false;

        // Adicionar variáveis para a posição relativa da bola
        this.distanciaBolaX = 20;
        this.distanciaBolaY = 8;

        // Adicionar evento de colisão
        this.physics.add.overlap(this.player, this.bola, this.pegarBola, null, this);
        
        // adicionar oponentes na lista e posicioná-los sobre as plataformas
        let plataformaIndex = 3; // Índice da plataforma atual para posicionar o oponente
        for (let i = 0; i < 5; i++) {
            // Posicionar oponente na coordenada X da plataforma
            let plataforma = this.plataformas.getChildren()[plataformaIndex];
            let oponente = new Oponente(this, plataforma.x, plataforma.y - 50, 'oponente', 0.5, 40, 65); // Definir escala e hitbox do oponente aqui
            this.oponentes.push(oponente);

            // Adicionar colisão entre o oponente e a plataforma
            this.physics.add.collider(oponente.sprite, this.plataformas);

            // Avançar para a próxima plataforma
            plataformaIndex = (plataformaIndex + 1) % this.plataformas.getChildren().length;
        }

        // Adicionar evento de colisão entre o jogador e os oponentes
        this.physics.add.collider(this.player, this.oponentes.map(op => op.sprite));
        // Adicionar evento de colisão entre a bola e os oponentes
        this.physics.add.collider(this.bola, this.oponentes.map(op => op.sprite), this.gameOver, null, this);
        // Adicionar evento de colisão entre a bola e a trave
        this.physics.add.collider(this.bola, this.trave, this.gameVitoria, null, this);
        
        // Adicionar a câmera
        this.cameras.main.startFollow(this.player, true);
        // Ajustar o zoom da câmera
        this.cameras.main.setZoom(2.5);
        
    }

    gameVitoria(bola, trave) { 
        this.scene.start('vitoria');//Mudar para a cena de Victoria
    }

    gameOver(bola, oponente) {
        this.scene.start('fimJogo'); // Mudar para a cena GameOver
    }

    
    // Função para conectar a bola ao jogador
    pegarBola(player, bola) {
        this.bolaPega = true;
        bola.body.setAllowGravity(false); // Desativar a gravidade para a bola
        bola.setVelocity(0); // Parar a bola
        bola.body.setImmovable(true); // Tornar a bola imóvel em relação a outras forças
    }

    // Função para alterar a posição da bola
    alterarPosicaoBola(distX, distY) {
        this.distanciaBolaX = distX;
        this.distanciaBolaY = distY;
    }

    update() {
        // movimenta-se para esquerda
        if (this.teclado.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.flipX = false; // Espelha o sprite para esquerda    
        }

        // Movimenta-se para direita
        else if (this.teclado.right.isDown) {
            this.player.setVelocityX(100);
            this.player.flipX = true; // Garante o sprite original
        }

        // sem movimento horizontal
        else {
            this.player.setVelocityX(0);
        }

        // Movimento para cima 
        if (this.teclado.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-300);
        }

        this.animarPlayer(this.player);

        // Lógica para manter a bola conectada ao jogador
        if (this.bolaPega) {
            if (this.player.flipX) {
                this.bola.x = this.player.x + this.distanciaBolaX; // Bola à frente do jogador ao mover-se para a esquerda
            } else {
                this.bola.x = this.player.x - this.distanciaBolaX; // Bola à frente do jogador ao mover-se para a direita
            }
            this.bola.y = this.player.y + this.distanciaBolaY; // Mantém a bola na posição relativa ao jogador

            // Garantir que a bola não passe pela plataforma
            this.physics.world.collide(this.bola, this.plataformas);
        }
        
        // Chamar o método convocarOponentes para mover os oponentes
        this.convocarOponentes();
    }

    animarPlayer(obj) {
        if (obj.y < this.alturaJogo - (79 / 2) && this.player.body.blocked.down == false) {
            obj.anims.play('salto', true);
        } else if (obj.body.velocity.x !== 0 && (this.teclado.left.isDown || this.teclado.right.isDown)) {
            obj.anims.play('move', true);
        } else {
            obj.anims.play('idle', true);
        }
    }

    // Método para convocar oponentes
    convocarOponentes() {
        for (let oponente of this.oponentes) {
            if (oponente.sprite.x < this.bola.x - 50) {
                oponente.mover('direita'); // Mover oponente para a direita
            } else if (oponente.sprite.x > this.bola.x + 50) {
                oponente.mover('esquerda'); // Mover oponente para a esquerda
            } else {
                oponente.parar(); // Parar o oponente quando está próximo à bola
            }
        }
    }
}

// Exemplo de como alterar a posição da bola
// Após a criação da cena
let scene = new fase1();
scene.alterarPosicaoBola(40, 10);
