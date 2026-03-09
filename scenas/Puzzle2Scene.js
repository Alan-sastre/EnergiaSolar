export default class Puzzle2Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Puzzle2Scene" });
    this.currentStage = 0; // 0: Start, 1: Solar Panel, 2: Pump, 3: Water/Crops
  }

  preload() {
    // No assets to load, will draw everything with Phaser Graphics
  }

  create() {
    // Fondo detallado
    this.createDetailedBackground();

    // Sol ambiente
    this.drawSun(900, 80, 50);

    // Sistema de riego (tuberías vacías)
    this.createIrrigationSystem();

    // Cultivos (marchitos al inicio)
    this.createCrops();

    // Zona de colocación (Bomba de agua y Panel)
    this.dropZonePanel = this.add
      .zone(200, 400, 100, 100)
      .setRectangleDropZone(100, 100);
    this.dropZonePump = this.add
      .zone(350, 400, 100, 100)
      .setRectangleDropZone(100, 100);

    // Indicadores visuales de dónde colocar (siluetas)
    this.add.rectangle(200, 400, 80, 60, 0x000000, 0.2); // Silueta panel
    this.add.rectangle(350, 400, 60, 60, 0x000000, 0.2); // Silueta bomba

    // Elementos arrastrables
    this.createDraggables();

    // Mano guía (Tutorial)
    this.createTutorialHand();

    // Animaciones ambientales
    this.createAmbientAnimations();

    // Estado del puzzle
    this.isPanelPlaced = false;
    this.isPumpPlaced = false;

    // Eventos
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = Phaser.Math.Clamp(dragX, 50, 950);
      gameObject.y = Phaser.Math.Clamp(dragY, 50, 470);
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      const type = gameObject.getData("type");

      if (type === "solar_panel" && dropZone === this.dropZonePanel) {
        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
        gameObject.input.enabled = false;
        this.isPanelPlaced = true;
        this.isDragging = false; // Asegurar que la bandera se resetee
        this.createBurst(dropZone.x, dropZone.y);
        this.checkWin();
      } else if (type === "water_pump" && dropZone === this.dropZonePump) {
        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
        gameObject.input.enabled = false;
        this.isPumpPlaced = true;
        this.isDragging = false; // Asegurar que la bandera se resetee
        this.createBurst(dropZone.x, dropZone.y);
        this.checkWin();
      } else {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });
  }

  createDetailedBackground() {
    // 1. Capa de Fondo (Cielo y Montañas Lejanas)
    const bg = this.add.graphics();
    const width = 1000;
    const height = 500;

    // Cielo
    bg.fillGradientStyle(0x4fc3f7, 0x4fc3f7, 0xe1f5fe, 0xe1f5fe, 1);
    bg.fillRect(0, 0, width, height);

    // Sol
    bg.fillStyle(0xffeb3b, 1);
    bg.fillCircle(880, 80, 45);
    bg.fillStyle(0xffffff, 0.4);
    bg.fillCircle(880, 80, 55);

    // Montañas Lejanas
    bg.fillStyle(0x90a4ae, 1);
    const mountains = new Phaser.Curves.Path(0, 400);
    mountains.lineTo(200, 250);
    mountains.lineTo(400, 400);
    mountains.lineTo(600, 300);
    mountains.lineTo(800, 400);
    mountains.lineTo(1000, 300);
    mountains.lineTo(1000, 500);
    mountains.lineTo(0, 500);
    mountains.closePath();
    bg.fillPoints(mountains.getPoints());

    // 2. Capa Intermedia (Colinas)
    const midLayer = this.add.graphics();
    midLayer.fillStyle(0x81c784, 1);
    const hills = new Phaser.Curves.Path(0, 450);
    hills.quadraticBezierTo(300, 350, 600, 420);
    hills.quadraticBezierTo(800, 450, 1000, 400);
    hills.lineTo(1000, 500);
    hills.lineTo(0, 500);
    hills.closePath();
    midLayer.fillPoints(hills.getPoints(200));

    // 3. Objetos de Fondo (Turbinas)
    // Se añaden aquí para estar sobre las colinas pero detrás del suelo principal si fuera necesario
    // Posicionamos las turbinas en la "cima" de las colinas visualmente
    this.createWindTurbine(150, 410, 0.6);
    this.createWindTurbine(850, 390, 0.5);
    this.createWindTurbine(500, 380, 0.4); // Lejana

    // Invernadero
    this.createModernGreenhouse(midLayer, 900, 420);

    // 4. Suelo Primer Plano
    const fg = this.add.graphics();
    fg.fillStyle(0x66bb6a, 1);
    // Rectángulo sólido para la base del juego
    fg.fillRect(0, 420, width, 180);

    // Borde de césped
    fg.fillStyle(0x558b2f, 1);
    fg.fillRect(0, 420, width, 10);

    // Flores
    for (let i = 0; i < 15; i++) {
      this.createFlower(
        fg,
        50 + i * 60 + Math.random() * 20,
        470 + Math.random() * 20,
      );
    }

    // Nubes
    this.createFluffyClouds(midLayer); // Nubes detrás del primer plano

    midLayer.fillStyle(0xffffff, 0.1);
    midLayer.fillEllipse(300, 260, 420, 90);
    midLayer.fillEllipse(760, 230, 360, 80);
  }

  createWindTurbine(x, y, scale) {
    const turbine = this.add.container(x, y);

    // Poste
    const pole = this.add.rectangle(0, 0, 4 * scale, 100 * scale, 0xffffff);
    pole.setOrigin(0.5, 1);
    turbine.add(pole);

    // Rotor (Aspas)
    const rotor = this.add.graphics();
    rotor.fillStyle(0xffffff, 1);
    rotor.y = -100 * scale;

    // Dibujar 3 aspas
    for (let i = 0; i < 3; i++) {
      rotor.fillRoundedRect(
        -2 * scale,
        -60 * scale,
        4 * scale,
        60 * scale,
        2 * scale,
      );
      rotor.rotation += (Math.PI * 2) / 3;
    }
    turbine.add(rotor);

    // Cabina central
    const hub = this.add.circle(0, -100 * scale, 5 * scale, 0xe0e0e0);
    turbine.add(hub);

    // Animación de rotación suave
    this.tweens.add({
      targets: rotor,
      angle: 360,
      duration: 4000 + Math.random() * 2000,
      repeat: -1,
      ease: "Linear",
    });
  }

  createModernGreenhouse(graphics, x, y) {
    // Estructura metálica ligera
    graphics.lineStyle(2, 0xe0e0e0, 0.9);
    graphics.fillStyle(0xe3f2fd, 0.6); // Vidrio azulado

    const width = 120;
    const height = 60;

    // Domo principal
    const dome = new Phaser.Curves.Path(x - width / 2, y);
    dome.quadraticBezierTo(x, y - height * 1.5, x + width / 2, y);
    dome.closePath();

    graphics.fillPoints(dome.getPoints());
    graphics.strokePoints(dome.getPoints());

    // Divisiones del vidrio
    graphics.lineStyle(1, 0xffffff, 0.5);
    graphics.beginPath();
    graphics.moveTo(x, y - height * 0.75); // Centro arriba
    graphics.lineTo(x, y);
    graphics.moveTo(x - width / 4, y - height * 0.6);
    graphics.lineTo(x - width / 4, y);
    graphics.moveTo(x + width / 4, y - height * 0.6);
    graphics.lineTo(x + width / 4, y);
    graphics.strokePath();

    // Base
    graphics.fillStyle(0x90a4ae, 1);
    graphics.fillRect(x - width / 2 - 5, y, width + 10, 10);
  }

  createFlower(graphics, x, y) {
    const color = Phaser.Utils.Array.GetRandom([
      0xff4081, 0xffeb3b, 0x7c4dff, 0xff9800,
    ]);
    // Tallo
    graphics.lineStyle(2, 0x4caf50);
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x, y - 10);
    graphics.strokePath();

    // Pétalos
    graphics.fillStyle(color, 1);
    graphics.fillCircle(x - 3, y - 12, 3);
    graphics.fillCircle(x + 3, y - 12, 3);
    graphics.fillCircle(x, y - 15, 3);
    graphics.fillCircle(x, y - 9, 3);
    // Centro
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(x, y - 12, 1.5);
  }

  // Métodos antiguos eliminados
  createCactus(x, y, s) {}
  createRock(x, y) {}

  createFluffyClouds(graphics) {
    graphics.fillStyle(0xffffff, 0.8);

    // Nube 1
    this.drawCloud(graphics, 150, 100, 1);
    // Nube 2
    this.drawCloud(graphics, 400, 60, 0.8);
    // Nube 3
    this.drawCloud(graphics, 700, 120, 1.2);
  }

  drawCloud(graphics, x, y, scale) {
    const s = scale;
    graphics.fillCircle(x, y, 30 * s);
    graphics.fillCircle(x + 25 * s, y - 10 * s, 35 * s);
    graphics.fillCircle(x + 50 * s, y, 30 * s);
    graphics.fillCircle(x + 25 * s, y + 10 * s, 25 * s);
  }

  createWaterPump(x, y) {
    const pumpContainer = this.add.container(x, y);
    const gfx = this.add.graphics();
    pumpContainer.add(gfx);

    // Estilo Industrial Moderno (Azul y Cromo)

    // 1. Base sólida
    gfx.fillStyle(0x263238, 1); // Gris oscuro
    gfx.fillRoundedRect(-40, 30, 80, 15, 4);

    // 2. Cuerpo del motor (Cilíndrico con brillo)
    // Cuerpo principal
    gfx.fillStyle(0x1976d2, 1); // Azul industrial
    gfx.fillRoundedRect(-35, -20, 70, 50, 8);

    // Brillo metálico (Reflejo)
    gfx.fillStyle(0xffffff, 0.2);
    gfx.fillRoundedRect(-35, -20, 70, 15, { tl: 8, tr: 8, bl: 0, br: 0 });

    // Aletas de refrigeración (Detalle técnico)
    gfx.fillStyle(0x1565c0, 1); // Azul más oscuro
    for (let i = 0; i < 3; i++) {
      gfx.fillRect(-35, -5 + i * 12, 70, 4);
    }

    // 3. Tubería de salida
    gfx.fillStyle(0x78909c, 1); // Gris metal
    gfx.fillRect(20, -10, 30, 15);
    // Brida de conexión
    gfx.fillStyle(0x546e7a, 1);
    gfx.fillRect(45, -15, 8, 25);
    // Hueco
    gfx.fillStyle(0x263238, 1);
    gfx.fillCircle(53, -2, 6);

    // 4. Panel de control / Manómetro
    // Caja superior
    gfx.fillStyle(0x455a64, 1);
    gfx.fillRect(-20, -35, 40, 15);

    // Manómetro circular
    gfx.fillStyle(0xffffff, 1);
    gfx.fillCircle(0, -35, 12);
    gfx.lineStyle(2, 0xeceff1);
    gfx.strokeCircle(0, -35, 12);

    // Aguja
    gfx.lineStyle(2, 0xd32f2f); // Rojo
    gfx.beginPath();
    gfx.moveTo(0, -35);
    gfx.lineTo(5, -40);
    gfx.strokePath();

    // 5. Válvula de control (Rueda lateral)
    gfx.lineStyle(3, 0xc62828); // Rojo
    gfx.strokeCircle(-45, 5, 12);
    gfx.lineStyle(2, 0xc62828);
    gfx.lineBetween(-45, -7, -45, 17);
    gfx.lineBetween(-57, 5, -33, 5);

    pumpContainer.setSize(90, 80);
    return pumpContainer;
  }

  createDraggables() {
    // Panel Solar
    this.panelItem = this.createSolarPanel(100, 150);
    this.panelItem.setInteractive();
    this.input.setDraggable(this.panelItem);
    this.panelItem.setData("type", "solar_panel");

    // Bomba de Agua
    this.pumpItem = this.createWaterPump(100, 300);
    this.pumpItem.setScale(0.8);
    this.pumpItem.setInteractive();
    this.input.setDraggable(this.pumpItem);
    this.pumpItem.setData("type", "water_pump");
  }

  createSolarPanel(x, y) {
    const panelContainer = this.add.container(x, y);
    const gfx = this.add.graphics();
    panelContainer.add(gfx);

    // Diseño de Panel Solar de Alta Eficiencia (Estilo moderno)
    // 1. Marco estructural (Aluminio pulido)
    gfx.fillStyle(0xe0e0e0, 1);
    gfx.fillRoundedRect(-52, -37, 104, 74, 6);

    // 2. Borde interno oscuro (Junta de estanqueidad)
    gfx.fillStyle(0x212121, 1);
    gfx.fillRoundedRect(-48, -33, 96, 66, 4);

    // 3. Células fotovoltaicas (Azul oscuro profundo con textura)
    gfx.fillStyle(0x0d47a1, 1);
    gfx.fillRoundedRect(-46, -31, 92, 62, 2);
    gfx.fillGradientStyle(0x1565c0, 0x0d47a1, 0x002171, 0x002171, 0.8);
    gfx.fillRect(-46, -31, 92, 62);

    // 4. Grid de celdas (Busbars finos)
    gfx.lineStyle(1, 0x90caf9, 0.3);
    const cellWidth = 92 / 4;
    for (let i = 1; i < 4; i++) {
      gfx.beginPath();
      gfx.moveTo(-46 + i * cellWidth, -31);
      gfx.lineTo(-46 + i * cellWidth, 31);
      gfx.strokePath();
    }
    const cellHeight = 62 / 3;
    for (let i = 1; i < 3; i++) {
      gfx.beginPath();
      gfx.moveTo(-46, -31 + i * cellHeight);
      gfx.lineTo(46, -31 + i * cellHeight);
      gfx.strokePath();
    }

    // Busbars principales
    gfx.lineStyle(2, 0xc0c0c0, 0.6);
    gfx.beginPath();
    gfx.moveTo(-23, -31);
    gfx.lineTo(-23, 31);
    gfx.moveTo(23, -31);
    gfx.lineTo(23, 31);
    gfx.strokePath();

    // 5. Reflejo especular
    gfx.fillStyle(0xffffff, 0.15);
    gfx.beginPath();
    gfx.moveTo(-46, -31);
    gfx.lineTo(-20, -31);
    gfx.lineTo(-46, 0);
    gfx.closePath();
    gfx.fillPath();

    // 6. Cables
    gfx.fillStyle(0x424242, 1);
    gfx.fillRoundedRect(-15, 37, 30, 10, 2);
    gfx.lineStyle(2, 0xf44336);
    gfx.lineBetween(-10, 42, -10, 50);
    gfx.lineStyle(2, 0x2196f3);
    gfx.lineBetween(10, 42, 10, 50);

    panelContainer.setSize(104, 74);
    return panelContainer;
  }

  createIrrigationSystem() {
    this.pipes = [];
    const pipeColor = 0x546e7a; // Gris tubería

    // Tubería principal desde la bomba (350, 400) hacia los cultivos
    // La bomba se coloca en (350, 400)
    // Tubería sale de la derecha de la bomba

    // Tubería vertical principal
    const mainV = this.add
      .rectangle(450, 390, 20, 110, pipeColor)
      .setOrigin(0.5, 0);
    this.pipes.push(mainV);

    // Conector horizontal a la bomba
    const conn = this.add
      .rectangle(400, 410, 60, 15, pipeColor)
      .setOrigin(0, 0.5);
    this.pipes.push(conn);

    // Tuberías horizontales a cada fila de cultivos
    const rows = [390, 420, 450, 480];
    rows.forEach((y) => {
      const hPipe = this.add
        .rectangle(450, y, 500, 10, pipeColor)
        .setOrigin(0, 0.5);
      this.pipes.push(hPipe);

      // Aspersores (pequeños círculos)
      for (let x = 500; x < 950; x += 100) {
        const sprink = this.add.circle(x, y, 4, 0x37474f);
        this.pipes.push(sprink);
      }
    });

    this.sprinklers = []; // Para la animación de agua
    rows.forEach((y) => {
      for (let x = 500; x < 950; x += 100) {
        this.sprinklers.push({ x, y });
      }
    });
  }

  updatePipes(isActive) {
    const color = isActive ? 0x29b6f6 : 0x546e7a; // Azul agua vs Gris
    this.pipes.forEach((p) => {
      if (p instanceof Phaser.GameObjects.Rectangle) {
        p.setFillStyle(color);
      }
    });
  }

  createCrops() {
    this.crops = [];
    const rows = [390, 420, 450, 480];

    rows.forEach((y) => {
      for (let x = 500; x < 950; x += 100) {
        const cropContainer = this.add.container(x, y - 20);
        this.drawWiltedCrop(cropContainer);
        this.crops.push({ container: cropContainer, x, y });
      }
    });
  }

  drawWiltedCrop(container) {
    container.removeAll(true);
    const gfx = this.add.graphics();
    container.add(gfx);

    gfx.fillStyle(0x8d6e63, 1); // Marrón seco

    // Tallo caído
    const path = new Phaser.Curves.Path(0, 20);
    path.quadraticBezierTo(10, 0, 20, 10);
    path.draw(gfx);

    // Hojas secas
    gfx.fillCircle(20, 10, 5);
    gfx.fillCircle(15, 15, 4);
  }

  drawHealthyCrop(container) {
    container.removeAll(true);
    const gfx = this.add.graphics();
    container.add(gfx);

    // Planta vibrante
    const green = 0x4caf50;
    const darkGreen = 0x2e7d32;

    // Tallo fuerte
    gfx.lineStyle(3, darkGreen);
    const stem = new Phaser.Curves.Path(0, 20);
    stem.lineTo(0, -10);
    stem.draw(gfx);

    // Hojas grandes
    gfx.fillStyle(green, 1);

    const leafL = new Phaser.Curves.Path(0, 0);
    leafL.quadraticBezierTo(-15, -5, -20, -15);
    leafL.quadraticBezierTo(-5, -15, 0, 0);
    leafL.closePath();
    gfx.fillPoints(leafL.getPoints());

    const leafR = new Phaser.Curves.Path(0, -5);
    leafR.quadraticBezierTo(15, -10, 20, -20);
    leafR.quadraticBezierTo(5, -20, 0, -5);
    leafR.closePath();
    gfx.fillPoints(leafR.getPoints());

    // Fruto/Flor (Tomate o similar)
    gfx.fillStyle(0xf44336, 1);
    gfx.fillCircle(0, -15, 6);
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
    this.hand.setRotation(0);

    this.isDragging = false;

    this.input.on("dragstart", () => {
      this.isDragging = true;
      this.hand.setVisible(false);
      this.tweens.killTweensOf(this.hand);
    });

    this.input.on("dragend", () => {
      this.isDragging = false;
      this.showHint();
    });

    // Iniciar inmediatamente
    this.showHint();
  }

  resetIdleTimer() {
    this.showHint();
  }

  showHint() {
    this.tweens.killTweensOf(this.hand);

    if (this.isDragging) return;

    let target = null;
    let dest = null;

    // Lógica secuencial estricta: Panel -> Bomba
    if (!this.isPanelPlaced) {
      target = this.panelItem;
      // Destino: Zona de caída del panel (dropZonePanel)
      dest = { x: this.dropZonePanel.x, y: this.dropZonePanel.y };
    } else if (!this.isPumpPlaced) {
      target = this.pumpItem;
      // Destino: Zona de caída de la bomba (dropZonePump)
      dest = { x: this.dropZonePump.x, y: this.dropZonePump.y };
    }

    if (target && dest) {
      this.hand.setVisible(true);
      // Posición inicial: Sobre el objeto a arrastrar
      this.hand.setPosition(target.x, target.y);
      this.hand.setAlpha(1);
      this.hand.setScale(1);
      this.hand.setDepth(200); // Asegurar que esté encima de todo

      this.tweens.timeline({
        tweens: [
          {
            targets: this.hand,
            scale: { from: 1.5, to: 1 },
            duration: 500,
            ease: "Back.out",
          },
          {
            targets: this.hand,
            x: dest.x,
            y: dest.y,
            duration: 1500,
            ease: "Power2",
          },
          {
            targets: this.hand,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              this.hand.setVisible(false);
              this.hand.setAlpha(1);
              if (!this.isDragging) {
                this.time.delayedCall(200, () => this.showHint());
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
    // Mariposas
    for (let i = 0; i < 5; i++) {
      const butterfly = this.add.graphics();
      butterfly.fillStyle(
        Phaser.Utils.Array.GetRandom([0xffeb3b, 0xff9800, 0xe91e63]),
        1,
      );
      butterfly.fillTriangle(-8, -8, -8, 8, 0, 0); // Ala izq
      butterfly.fillTriangle(8, -8, 8, 8, 0, 0); // Ala der

      const bCont = this.add.container(
        Math.random() * 1000,
        250 + Math.random() * 150,
        [butterfly],
      );

      this.tweens.add({
        targets: bCont,
        x: { from: bCont.x, to: bCont.x + (Math.random() * 300 - 150) },
        y: { from: bCont.y, to: bCont.y + (Math.random() * 100 - 50) },
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      // Aleteo rápido
      this.tweens.add({
        targets: butterfly,
        scaleX: 0.2,
        duration: 150,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  drawSun(x, y, radius) {
    const sunContainer = this.add.container(x, y);
    const sun = this.add.graphics();

    // 1. Núcleo Blanco Brillante (Intensidad máxima)
    sun.fillStyle(0xffffff, 1);
    sun.fillCircle(0, 0, radius * 0.8);

    // 2. Corona Dorada (Gradiente radial simulado)
    sun.fillStyle(0xffeb3b, 0.6);
    sun.fillCircle(0, 0, radius);

    // 3. Resplandor Exterior (Bloom/Glow)
    sun.fillStyle(0xff9800, 0.2);
    sun.fillCircle(0, 0, radius * 2);

    sun.fillStyle(0xff5722, 0.1);
    sun.fillCircle(0, 0, radius * 3);

    // 4. Rayos de Luz (God Rays) - Sutiles
    sun.lineStyle(2, 0xffffff, 0.1);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      sun.beginPath();
      sun.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      sun.lineTo(Math.cos(angle) * radius * 4, Math.sin(angle) * radius * 4);
      sun.strokePath();
    }

    // Blend mode aditivo para que "queme" el cielo detrás
    sun.setBlendMode(Phaser.BlendModes.ADD);

    sunContainer.add(sun);

    // Animación de pulsación suave para dar vida
    this.tweens.add({
      targets: sunContainer,
      scaleX: 1.05,
      scaleY: 1.05,
      alpha: 0.9,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    return sunContainer;
  }

  createBurst(x, y) {
    for (let i = 0; i < 12; i++) {
      const color = Phaser.Utils.Array.GetRandom([
        0x2196f3, 0x4caf50, 0x8bc34a,
      ]);
      const p = this.add.circle(x, y, 4, color);
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 40;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.1,
        duration: 600,
        ease: "Quad.out",
        onComplete: () => p.destroy(),
      });
    }
  }

  checkWin() {
    if (this.isPanelPlaced && this.isPumpPlaced) {
      this.hand.setVisible(false); // Ocultar mano al ganar
      this.activateSystem();
    } else {
      // Si falta algo, seguir mostrando la ayuda
      this.time.delayedCall(500, () => this.showHint());
    }
  }

  activateSystem() {
    // 1. Activar tuberías (Cambio visual a activo)
    this.updatePipes(true);

    // 2. Animación agua saliendo de aspersores
    this.time.delayedCall(700, () => {
      this.sprinklers.forEach((s) => {
        // Create a container for water drops for each sprinkler
        const waterContainer = this.add.container(s.x, s.y);

        // Generate multiple water drops
        for (let i = 0; i < 15; i++) {
          const drop = this.add.graphics();
          drop.fillStyle(0x2196f3, 0.8); // Blue water
          drop.fillCircle(0, 0, 2); // Draw a small circle at container's origin

          waterContainer.add(drop);

          this.tweens.add({
            targets: drop,
            x: Math.random() * 20 - 10, // Random horizontal spread
            y: 50 + Math.random() * 30, // Fall downwards
            alpha: 0,
            scale: 0.5,
            duration: 800 + Math.random() * 400,
            ease: "Quad.easeIn",
            delay: Math.random() * 300, // Stagger the drops
            onComplete: () => drop.destroy(),
            repeat: -1, // Repeat indefinitely
            yoyo: false,
          });
        }
      });

      // 3. Cultivos reverdecen
      this.time.delayedCall(1900, () => {
        this.crops.forEach((c) => {
          this.drawHealthyCrop(c.container);

          // Efecto "pop"
          this.tweens.add({
            targets: c.container,
            scaleX: 1.1,
            scaleY: 1.1,
            yoyo: true,
            duration: 200,
          });
        });

        this.showWinAnimation();
      });
    });
  }

  showWinAnimation() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fondo oscurecido para resaltar
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5);
    overlay.setOrigin(0, 0);
    overlay.setAlpha(0);

    this.tweens.add({
      targets: overlay,
      alpha: 0.7,
      duration: 800,
    });

    // Secuencia de Fuegos Artificiales
    this.tweens.timeline({
      tweens: [
        {
          targets: overlay,
          duration: 500,
          onComplete: () =>
            this.createFirework(width * 0.2, height * 0.4, 0xffeb3b),
        },
        {
          targets: overlay,
          duration: 300,
          onComplete: () =>
            this.createFirework(width * 0.8, height * 0.3, 0x2196f3),
        },
        {
          targets: overlay,
          duration: 300,
          onComplete: () =>
            this.createFirework(width * 0.5, height * 0.2, 0xe91e63),
        },
        {
          targets: overlay,
          duration: 300,
          onComplete: () => {
            this.createFirework(width * 0.3, height * 0.6, 0x4caf50);
            this.createFirework(width * 0.7, height * 0.6, 0xff9800);
          },
        },
        {
          targets: overlay,
          duration: 2800, // Pausa para ver la celebración
          onComplete: () => {
            // Transición automática al siguiente puzzle
            this.cameras.main.fade(1600, 0, 0, 0, false, (camera, progress) => {
              if (progress === 1) {
                this.scene.start("Puzzle3Scene");
              }
            });
          },
        },
      ],
    });
  }

  createFirework(x, y, color) {
    // Explosión central
    const burst = this.add.circle(x, y, 5, color);
    this.tweens.add({
      targets: burst,
      scale: 3,
      alpha: 0,
      duration: 300,
      onComplete: () => burst.destroy(),
    });

    // Partículas
    for (let i = 0; i < 30; i++) {
      const p = this.add.circle(x, y, Phaser.Math.Between(2, 4), color);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = Phaser.Math.FloatBetween(100, 300);

      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: { from: 1, to: 0 },
        scale: { from: 1, to: 0 },
        duration: Phaser.Math.Between(800, 1500),
        ease: "Power2",
        onComplete: () => p.destroy(),
      });
    }
  }
}
