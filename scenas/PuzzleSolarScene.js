export default class PuzzleSolarScene extends Phaser.Scene {
  constructor() {
    super({ key: "PuzzleSolarScene" });
    this.dirtSpots = [];
    this.isDragging = false;
  }

  preload() {
    // No external assets, using Phaser Graphics
  }

  create() {
    // 1. Fondo (Cielo y Césped)
    this.createBackground();

    // 2. Sol (Animado)
    this.sun = this.drawSun(900, 100, 60);

    // 3. Panel Solar (Grande y central)
    this.createLargeSolarPanel();

    // 4. Suciedad (Dirt spots)
    this.createDirt();

    // 5. Lógica de limpieza (Interacción)
    this.input.on("pointerdown", () => {
      this.isDragging = true;
      this.hideTutorialHand();
    });

    this.input.on("pointerup", () => {
      this.isDragging = false;
      this.resetIdleTimer();
    });

    this.input.on("pointermove", (pointer) => {
      if (this.isDragging) {
        this.cleanDirt(pointer);
      }
    });

    // 6. Tutorial (Mano frotando)
    this.createTutorialHand();

    // 7. Animaciones ambientales
    this.createAmbientAnimations();
  }

  createBackground() {
    const bg = this.add.graphics();
    const width = 1000;
    const height = 500;

    // 1. Cielo Vibrante (Azul profundo a celeste claro)
    bg.fillGradientStyle(0x0288d1, 0x0288d1, 0xb3e5fc, 0xb3e5fc, 1);
    bg.fillRect(0, 0, width, height);

    // 2. Montañas Lejanas (Majestuosas y púrpuras por la distancia)
    bg.fillStyle(0x5c6bc0, 1);
    const mountain1 = new Phaser.Curves.Path(0, 420);
    mountain1.lineTo(150, 250);
    mountain1.lineTo(350, 420);
    mountain1.closePath();
    bg.fillPoints(mountain1.getPoints());

    bg.fillStyle(0x7986cb, 1);
    const mountain2 = new Phaser.Curves.Path(200, 420);
    mountain2.lineTo(450, 300);
    mountain2.lineTo(700, 420);
    mountain2.closePath();
    bg.fillPoints(mountain2.getPoints());

    bg.fillStyle(0x9fa8da, 1); // Más clara, más cerca
    const mountain3 = new Phaser.Curves.Path(600, 420);
    mountain3.lineTo(850, 350);
    mountain3.lineTo(1000, 420);
    mountain3.closePath();
    bg.fillPoints(mountain3.getPoints());

    // 3. Colinas Suaves (Verde vibrante)
    bg.fillStyle(0x66bb6a, 1);
    const hill1 = new Phaser.Curves.Path(0, 500);
    hill1.cubicBezierTo(200, 400, 500, 370, 800, 460);
    hill1.lineTo(1000, 500);
    hill1.closePath();
    bg.fillPoints(hill1.getPoints());

    bg.fillStyle(0x81c784, 1); // Colina frontal
    const hill2 = new Phaser.Curves.Path(0, 500);
    hill2.cubicBezierTo(300, 450, 600, 420, 1000, 480);
    hill2.lineTo(1000, 500);
    hill2.closePath();
    bg.fillPoints(hill2.getPoints());

    // 4. Nubes Esponjosas
    this.createClouds(bg);

    bg.fillStyle(0xffffff, 0.08);
    bg.fillEllipse(280, 240, 520, 120);
    bg.fillEllipse(760, 210, 420, 110);

    // 5. Decoración Vegetal (Arbustos lejanos)
    bg.fillStyle(0x2e7d32, 1);
    for (let i = 0; i < 5; i++) {
      const x = 50 + i * 200 + Math.random() * 100;
      const y = 450 + Math.random() * 20;
      bg.fillCircle(x, y, 20);
      bg.fillCircle(x + 15, y - 10, 25);
      bg.fillCircle(x + 30, y, 20);
    }
  }

  createClouds(graphics) {
    graphics.fillStyle(0xffffff, 0.8);
    // Nube 1
    this.drawCloud(graphics, 100, 100, 1);
    // Nube 2
    this.drawCloud(graphics, 400, 80, 1.2);
    // Nube 3
    this.drawCloud(graphics, 750, 120, 0.8);
  }

  drawCloud(graphics, x, y, scale) {
    const s = scale;
    graphics.fillCircle(x, y, 30 * s);
    graphics.fillCircle(x + 25 * s, y - 10 * s, 35 * s);
    graphics.fillCircle(x + 50 * s, y, 30 * s);
    graphics.fillCircle(x + 25 * s, y + 10 * s, 25 * s);
  }

  drawSun(x, y, radius) {
    const sun = this.add.container(x, y);

    const core = this.add.graphics();
    core.fillStyle(0xffff00, 1);
    core.fillCircle(0, 0, radius);
    sun.add(core);

    // Rayos
    for (let i = 0; i < 12; i++) {
      const ray = this.add.graphics();
      ray.fillStyle(0xffd700, 0.8);
      ray.fillTriangle(radius, -10, radius + 40, 0, radius, 10);
      ray.angle = i * 30;
      sun.add(ray);
    }

    // Animación de rotación suave
    this.tweens.add({
      targets: sun,
      angle: 360,
      duration: 20000,
      repeat: -1,
      ease: "Linear",
    });

    return sun;
  }

  createLargeSolarPanel() {
    this.panelContainer = this.add.container(500, 300);

    const panelWidth = 450;
    const panelHeight = 280;

    const graphics = this.add.graphics();

    // Sombra del panel
    graphics.fillStyle(0x000000, 0.3);
    graphics.fillRoundedRect(
      -panelWidth / 2 + 10,
      -panelHeight / 2 + 10,
      panelWidth,
      panelHeight,
      15,
    );

    // Soporte metálico robusto
    graphics.fillStyle(0x757575, 1); // Gris metal
    graphics.fillRect(-15, panelHeight / 2, 30, 60);
    graphics.lineStyle(2, 0x424242);
    graphics.strokeRect(-15, panelHeight / 2, 30, 60); // Borde soporte

    // Base del soporte
    graphics.fillStyle(0x616161, 1);
    graphics.fillTriangle(-40, 170, 40, 170, 0, panelHeight / 2 + 10);

    // Marco del panel (Aluminio)
    graphics.fillStyle(0xe0e0e0, 1); // Gris claro brillante
    graphics.fillRoundedRect(
      -panelWidth / 2 - 10,
      -panelHeight / 2 - 10,
      panelWidth + 20,
      panelHeight + 20,
      15,
    );
    graphics.lineStyle(2, 0xbdbdbd);
    graphics.strokeRoundedRect(
      -panelWidth / 2 - 10,
      -panelHeight / 2 - 10,
      panelWidth + 20,
      panelHeight + 20,
      15,
    );

    // Fondo del panel (Azul profundo)
    graphics.fillStyle(0x0d47a1, 1);
    graphics.fillRoundedRect(
      -panelWidth / 2,
      -panelHeight / 2,
      panelWidth,
      panelHeight,
      5,
    );

    // Celdas solares individuales con gradiente
    const cols = 6;
    const rows = 4;
    const cellW = panelWidth / cols;
    const cellH = panelHeight / rows;
    const gap = 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = -panelWidth / 2 + c * cellW + gap;
        const cy = -panelHeight / 2 + r * cellH + gap;
        const cw = cellW - gap * 2;
        const ch = cellH - gap * 2;

        // Celda base
        graphics.fillStyle(0x1565c0, 1); // Azul
        graphics.fillRect(cx, cy, cw, ch);

        // Brillo superior (efecto cristal)
        graphics.fillStyle(0x42a5f5, 0.3);
        graphics.fillRect(cx, cy, cw, ch / 2);
      }
    }

    // Reflejo diagonal grande sobre todo el panel
    graphics.fillStyle(0xffffff, 0.1);
    graphics.beginPath();
    graphics.moveTo(-panelWidth / 2, -panelHeight / 2);
    graphics.lineTo(-panelWidth / 2 + 100, -panelHeight / 2);
    graphics.lineTo(panelWidth / 2, panelHeight / 2 - 100);
    graphics.lineTo(panelWidth / 2, panelHeight / 2);
    graphics.closePath();
    graphics.fillPath();

    this.panelContainer.add(graphics);
  }

  createDirt() {
    this.dirtGroup = this.add.group();
    const positions = [
      { x: -120, y: -60 },
      { x: 80, y: 30 },
      { x: -160, y: 90 },
      { x: 140, y: -90 },
      { x: 0, y: 0 },
      { x: 100, y: 80 },
      { x: -90, y: -70 },
      { x: 180, y: 20 },
      { x: -180, y: -20 },
    ];

    positions.forEach((pos) => {
      const dirt = this.add.graphics();

      // Color tierra/barro con opacidad variable
      const color = Phaser.Utils.Array.GetRandom([
        0x5d4037, 0x4e342e, 0x3e2723,
      ]);
      dirt.fillStyle(color, 0.9);

      // Forma irregular "mancha"
      const r = 35 + Math.random() * 15;
      dirt.fillCircle(0, 0, r);
      dirt.fillCircle(r * 0.5, r * 0.4, r * 0.7);
      dirt.fillCircle(-r * 0.4, r * 0.5, r * 0.6);
      dirt.fillCircle(r * 0.3, -r * 0.5, r * 0.7);
      dirt.fillCircle(-r * 0.5, -r * 0.3, r * 0.6);

      // Salpicaduras pequeñas alrededor
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = r * (1.2 + Math.random() * 0.5);
        const sr = 3 + Math.random() * 5;
        dirt.fillCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, sr);
      }

      const container = this.add.container(500 + pos.x, 300 + pos.y, [dirt]);

      // Rotación aleatoria para variedad
      container.rotation = Math.random() * Math.PI * 2;

      // Hit area circular para detección fácil (un poco más grande que la mancha base)
      const hitArea = new Phaser.Geom.Circle(0, 0, 60);
      container.setData("hitArea", hitArea);
      container.setData("health", 100); // Vida de la mancha

      this.dirtSpots.push(container);
    });
  }

  cleanDirt(pointer) {
    // Efecto de partículas al limpiar (opcional, simple círculo temporal)
    const particle = this.add.circle(pointer.x, pointer.y, 10, 0xffffff, 0.5);
    this.tweens.add({
      targets: particle,
      scale: 0,
      alpha: 0,
      duration: 500,
      onComplete: () => particle.destroy(),
    });

    for (let i = this.dirtSpots.length - 1; i >= 0; i--) {
      const dirt = this.dirtSpots[i];
      const hitArea = dirt.getData("hitArea");

      // Verificar si el puntero está sobre la mancha (ajustando coordenadas relativas)
      if (
        Phaser.Geom.Circle.Contains(
          hitArea,
          pointer.x - dirt.x,
          pointer.y - dirt.y,
        )
      ) {
        let health = dirt.getData("health");
        health -= 5; // Reducir opacidad/vida rápidamente
        dirt.setData("health", health);
        dirt.setAlpha(health / 100);

        if (health <= 0) {
          this.dirtSpots.splice(i, 1);
          dirt.destroy();
          this.checkWinCondition();
        }
      }
    }
  }

  checkWinCondition() {
    if (this.dirtSpots.length === 0) {
      // Panel limpio -> Brillo y victoria
      this.playWinAnimation();
    }
  }

  playWinAnimation() {
    // 1. Destello en el panel
    const flash = this.add.rectangle(500, 300, 400, 250, 0xffffff);
    flash.setAlpha(0);

    this.tweens.add({
      targets: flash,
      alpha: 0.8,
      duration: 300,
      yoyo: true,
      onComplete: () => flash.destroy(),
    });

    // 2. Panel se vuelve más brillante/claro
    // (Ya es azul, pero podemos añadir un efecto de "limpio")
    const shine = this.add.graphics();
    shine.fillStyle(0xffffff, 0.3);
    shine.beginPath();
    shine.moveTo(300, 175); // Esquina superior izquierda del panel (aprox)
    shine.lineTo(350, 175);
    shine.lineTo(700, 425); // Esquina inferior derecha
    shine.lineTo(650, 425);
    shine.closePath();
    shine.fillPath();

    this.tweens.add({
      targets: shine,
      x: 100, // Mover el brillo
      duration: 1000,
      repeat: 2,
      yoyo: true,
    });

    // 3. Mensaje de victoria
    this.showWinMessage();
  }

  showWinMessage() {
    const winText = this.add
      .text(500, 150, "¡Panel Limpio!", {
        fontSize: "60px",
        color: "#ffffff",
        backgroundColor: "#4CAF50",
        padding: { x: 20, y: 10 },
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.tweens.add({
      targets: winText,
      scale: { from: 0, to: 1 },
      alpha: { from: 0, to: 1 },
      ease: "Back.out",
      duration: 800,
      onComplete: () => {
        // Transición a la siguiente escena después de un breve retraso
        this.time.delayedCall(3200, () => {
          this.cameras.main.fade(1400, 0, 0, 0, false, (camera, progress) => {
            if (progress === 1) {
              this.scene.start("Puzzle2Scene");
            }
          });
        });
      },
    });
  }

  createTutorialHand() {
    this.hand = this.add.container(0, 0);

    // Mano emoji
    const handText = this.add
      .text(0, 0, "👆🏻", {
        fontSize: "50px",
      })
      .setOrigin(0.5);

    this.hand.add(handText);
    this.hand.setDepth(100);
    this.hand.setVisible(false);
    // Ajustar rotación si es necesario para que apunte bien
    this.hand.setRotation(0);

    // Iniciar la guía inmediatamente
    this.showHint();
  }

  hideTutorialHand() {
    this.hand.setVisible(false);
    this.tweens.killTweensOf(this.hand);
  }

  resetIdleTimer() {
    // Ya no usamos timer, la mano aparece inmediatamente después de la interacción
    this.showHint();
  }

  showHint() {
    // Detener cualquier tween anterior
    this.tweens.killTweensOf(this.hand);

    if (this.dirtSpots.length > 0) {
      // Encontrar una mancha para señalar (aleatoria para variar)
      const targetDirt = Phaser.Utils.Array.GetRandom(this.dirtSpots);

      this.hand.setVisible(true);
      this.hand.setAlpha(1);

      // Posición inicial cerca de la mancha
      this.hand.setPosition(targetDirt.x + 30, targetDirt.y + 30);
      this.hand.setScale(1.2);

      // Animación de frotar continua
      this.tweens.timeline({
        tweens: [
          {
            targets: this.hand,
            x: targetDirt.x,
            y: targetDirt.y,
            duration: 500,
            ease: "Power2",
          },
          {
            targets: this.hand,
            x: targetDirt.x - 40,
            y: targetDirt.y + 10,
            duration: 400,
            yoyo: true,
            repeat: 3,
            ease: "Sine.easeInOut",
          },
          {
            targets: this.hand,
            duration: 200,
            onComplete: () => {
              if (this.dirtSpots.length > 0 && !this.isDragging) {
                this.showHint();
              } else {
                this.hand.setVisible(false);
              }
            },
          },
        ],
      });
    } else {
      this.hand.setVisible(false);
    }
  }

  createAmbientAnimations() {
    // Nubes flotando
    for (let i = 0; i < 4; i++) {
      const cloud = this.add.graphics();
      cloud.fillStyle(0xffffff, 0.7);
      cloud.fillCircle(0, 0, 30 + Math.random() * 20);
      cloud.fillCircle(30, 10, 30 + Math.random() * 20);
      cloud.fillCircle(-30, 10, 30 + Math.random() * 20);

      const container = this.add.container(
        Phaser.Math.Between(0, 1000),
        Phaser.Math.Between(50, 200),
        [cloud],
      );

      this.tweens.add({
        targets: container,
        x: container.x + 200,
        duration: Phaser.Math.Between(10000, 20000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }
}
