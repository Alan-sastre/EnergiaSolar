export default class Puzzle3Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Puzzle3Scene" });
  }

  preload() {
    // No assets to load, will draw everything with Phaser Graphics
  }

  create() {
    // Fondo nocturno detallado
    this.createNightBackground();

    // Farola (Apagada al inicio)
    this.createStreetLamp();

    // Banco del parque (Decoración mejorada)
    this.createDetailedBench();

    // Personaje de fondo (Ambientación)
    this.createBackgroundCharacter();

    // Zonas de colocación
    this.dropZonePanel = this.add
      .zone(200, 115, 100, 100)
      .setRectangleDropZone(100, 100);
    this.dropZoneBattery = this.add
      .zone(200, 430, 80, 80)
      .setRectangleDropZone(80, 80);

    // Siluetas guía (Más sutiles y elegantes)
    this.add
      .rectangle(200, 115, 80, 60, 0xffffff, 0.05)
      .setStrokeStyle(2, 0xffffff, 0.2); // Panel en poste
    this.add
      .rectangle(200, 430, 50, 70, 0xffffff, 0.05)
      .setStrokeStyle(2, 0xffffff, 0.2); // Batería en base

    // Elementos arrastrables
    this.createDraggables();

    // Mano guía (Tutorial)
    this.createTutorialHand();

    // Animaciones ambientales
    this.createAmbientAnimations();

    this.isPanelPlaced = false;
    this.isBatteryPlaced = false;

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
        this.isDragging = false; // Asegurar que se resetee la bandera
        this.createBurst(dropZone.x, dropZone.y);
        this.checkWin();
      } else if (type === "battery" && dropZone === this.dropZoneBattery) {
        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
        gameObject.input.enabled = false;
        this.isBatteryPlaced = true;
        this.isDragging = false; // Asegurar que se resetee la bandera
        this.createBurst(dropZone.x, dropZone.y);
        this.checkWin();
      } else {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });
  }

  createNightBackground() {
    const bg = this.add.graphics();
    const width = 1000;
    const height = 500;

    // 1. Cielo Nocturno/Atardecer (Gradiente de alta calidad)
    // De azul profundo espacial a un morado/naranja de atardecer urbano
    bg.fillGradientStyle(0x0f172a, 0x0f172a, 0x312e81, 0x4338ca, 1);
    bg.fillRect(0, 0, width, height);
    bg.fillStyle(0x7c3aed, 0.08);
    bg.fillEllipse(320, 210, 560, 140);
    bg.fillEllipse(760, 180, 500, 120);

    // Estrellas (Fondo lejano con brillo variable)
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * width;
      const y = Math.random() * (height * 0.6);
      const size = Math.random() * 2;
      const alpha = Math.random() * 0.8 + 0.2;
      bg.fillStyle(0xffffff, alpha);
      bg.fillCircle(x, y, size);
    }

    // Luna (Mejorada con resplandor y cráteres detallados)
    this.drawDetailedMoon(bg, 850, 100);

    // 2. Skyline de la Ciudad (Siluetas detalladas)
    this.drawCitySkyline(bg, width, height);

    // 3. Suelo del Parque (Texturizado y detallado)
    this.drawParkGround(bg, width, height);

    // Árboles detallados
    this.createDetailedTrees(bg);

    // Poste para la estación solar (a la izquierda) - Rediseñado
    // Base de hormigón
    bg.fillStyle(0x94a3b8, 1);
    bg.fillRoundedRect(170, 460, 60, 15, 2);
    // Sombra de la base
    bg.fillStyle(0x64748b, 1);
    bg.fillRect(170, 470, 60, 5);

    // Poste principal (Metal oscuro)
    bg.fillStyle(0x334155, 1);
    bg.fillRoundedRect(190, 150, 20, 320, 2);

    // Detalles del poste (Uniones/Refuerzos)
    bg.fillStyle(0x475569, 1);
    bg.fillRect(188, 250, 24, 10);
    bg.fillRect(188, 350, 24, 10);

    // Soporte articulado para panel
    bg.fillStyle(0x475569, 1);
    bg.fillCircle(200, 150, 15); // Articulación
    bg.fillRect(170, 145, 60, 10); // Brazo horizontal

    // Cables colgando (Detalle realista)
    bg.lineStyle(2, 0x1e293b);
    const cable = new Phaser.Curves.Path(200, 160);
    cable.quadraticBezierTo(210, 200, 200, 300); // Cable suelto
    cable.draw(bg);
  }

  drawDetailedMoon(bg, x, y) {
    // Resplandor exterior (Bloom)
    bg.fillStyle(0xffffff, 0.05);
    bg.fillCircle(x, y, 60);
    bg.fillStyle(0xffffff, 0.1);
    bg.fillCircle(x, y, 40);

    // Luna base
    bg.fillStyle(0xe2e8f0, 1);
    bg.fillCircle(x, y, 25);

    // Sombra (Fase lunar gibosa)
    bg.fillStyle(0x94a3b8, 0.2);
    bg.fillCircle(x - 5, y + 5, 20);

    // Cráteres
    bg.fillStyle(0xcbd5e1, 1);
    bg.fillCircle(x - 10, y + 5, 6);
    bg.fillCircle(x + 8, y - 8, 5);
    bg.fillCircle(x + 5, y + 10, 3);
    bg.fillCircle(x - 2, y - 10, 4);
  }

  drawCitySkyline(bg, width, height) {
    const groundY = 450;

    // Capa 3: Edificios lejanos (Atmosféricos)
    bg.fillStyle(0x1e1b4b, 0.8);
    // Silueta continua de edificios bajos y altos
    const farPath = new Phaser.Curves.Path(0, groundY);
    farPath.lineTo(0, groundY - 100);
    farPath.lineTo(50, groundY - 100);
    farPath.lineTo(50, groundY - 150); // Rascacielos lejano
    farPath.lineTo(100, groundY - 150);
    farPath.lineTo(100, groundY - 80);
    farPath.lineTo(200, groundY - 120);
    farPath.lineTo(300, groundY - 60);
    farPath.lineTo(400, groundY - 140); // Torre
    farPath.lineTo(420, groundY - 140);
    farPath.lineTo(420, groundY - 60);
    farPath.lineTo(600, groundY - 90);
    farPath.lineTo(700, groundY - 160);
    farPath.lineTo(750, groundY - 160);
    farPath.lineTo(750, groundY - 70);
    farPath.lineTo(width, groundY - 70);
    farPath.lineTo(width, groundY);
    farPath.closePath();
    bg.fillPoints(farPath.getPoints());

    // Capa 2: Edificios medios (Con ventanas)
    bg.fillStyle(0x0f172a, 0.95);

    // Edificio 1
    bg.fillRect(50, groundY - 180, 80, 180);
    // Antena
    bg.lineStyle(2, 0x0f172a);
    bg.lineBetween(90, groundY - 180, 90, groundY - 220);

    // Edificio 2 (Escalonado)
    bg.fillRect(200, groundY - 200, 100, 200);
    bg.fillRect(210, groundY - 220, 80, 20);

    // Edificio 3 (Torre con cúpula)
    bg.fillRect(500, groundY - 250, 70, 250);
    bg.fillCircle(535, groundY - 250, 35); // Cúpula

    // Edificio 4 (Moderno inclinado)
    const modernPath = new Phaser.Curves.Path(800, groundY);
    modernPath.lineTo(800, groundY - 220);
    modernPath.lineTo(880, groundY - 200); // Techo inclinado
    modernPath.lineTo(880, groundY);
    modernPath.closePath();
    bg.fillPoints(modernPath.getPoints());

    // Ventanas (Luces de ciudad)
    bg.fillStyle(0xfef08a, 0.4); // Luz cálida
    // Ventanas aleatorias pero alineadas
    const drawWindows = (bx, by, w, h) => {
      const rows = Math.floor(h / 20);
      const cols = Math.floor(w / 15);
      for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
          if (Math.random() > 0.4) {
            bg.fillRect(bx + c * 15, by + r * 20, 6, 10);
          }
        }
      }
    };

    drawWindows(50, groundY - 180, 80, 180);
    drawWindows(200, groundY - 200, 100, 200);
    drawWindows(500, groundY - 250, 70, 250);
    drawWindows(800, groundY - 220, 80, 220);

    // Capa 1: Primer plano oscuro (Siluetas parque)
    // Se dibuja en drawParkGround
  }

  drawParkGround(bg, width, height) {
    const groundY = 450;

    // Césped base (Degradado nocturno)
    bg.fillGradientStyle(0x064e3b, 0x064e3b, 0x022c22, 0x022c22, 1);
    bg.fillRect(0, groundY, width, height - groundY);

    // Textura de césped
    bg.fillStyle(0x10b981, 0.1);
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * width;
      const y = groundY + Math.random() * (height - groundY);
      bg.fillRect(x, y, 2, 2);
    }

    // Camino pavimentado (Curvo y elegante)
    const path = new Phaser.Curves.Path(0, height);
    path.cubicBezierTo(200, 470, 500, 450, width, 470);
    path.lineTo(width, 500);
    path.cubicBezierTo(500, 470, 200, 500, 0, height - 10);
    path.closePath();

    bg.fillStyle(0x57534e, 1); // Piedra
    bg.fillPoints(path.getPoints());

    // Bordes del camino
    bg.lineStyle(4, 0x44403c); // Borde piedra
    path.draw(bg);

    // Adoquines en el camino
    bg.lineStyle(1, 0x292524, 0.3);
    for (let i = 0; i < 30; i++) {
      const t = i / 30;
      const p1 = path.getPoint(t * 0.5); // Lado superior del camino (aprox)
      // Simplificación: dibujar líneas cortas aleatorias en la zona del camino
      // Es difícil mapear exactamente al path sin lógica compleja,
      // así que usaremos puntos dispersos en la zona central
      const px = Math.random() * width;
      const py = 455 + Math.random() * 35;
      if (py > 450 && py < 500) {
        // Filtro burdo
        bg.lineBetween(px, py, px + 10, py + 5);
      }
    }
  }

  createDetailedTrees(graphics) {
    // Función auxiliar para dibujar un árbol
    const drawTree = (x, bottomY, scale) => {
      // Tronco
      graphics.fillStyle(0x3e2723, 1); // Marrón oscuro madera
      const trunkWidth = 20 * scale;
      const trunkHeight = 100 * scale;

      // Tronco cónico
      const trunk = new Phaser.Curves.Path(x - trunkWidth / 2, bottomY);
      trunk.lineTo(x - trunkWidth / 3, bottomY - trunkHeight);
      trunk.lineTo(x + trunkWidth / 3, bottomY - trunkHeight);
      trunk.lineTo(x + trunkWidth / 2, bottomY);
      trunk.closePath();
      graphics.fillPoints(trunk.getPoints());

      // Ramas (implícitas en el follaje)

      // Follaje (Múltiples capas para volumen)
      const leavesColorBase = 0x15803d; // Verde bosque
      const leavesColorDark = 0x14532d; // Sombra
      const leavesColorLight = 0x16a34a; // Luz

      const radius = 40 * scale;

      // Capa trasera (Sombra)
      graphics.fillStyle(leavesColorDark, 1);
      graphics.fillCircle(
        x - radius * 0.8,
        bottomY - trunkHeight - radius * 0.2,
        radius,
      );
      graphics.fillCircle(
        x + radius * 0.8,
        bottomY - trunkHeight - radius * 0.2,
        radius,
      );

      // Capa media (Base)
      graphics.fillStyle(leavesColorBase, 1);
      graphics.fillCircle(x, bottomY - trunkHeight - radius, radius * 1.2);
      graphics.fillCircle(
        x - radius * 0.6,
        bottomY - trunkHeight - radius * 0.5,
        radius,
      );
      graphics.fillCircle(
        x + radius * 0.6,
        bottomY - trunkHeight - radius * 0.5,
        radius,
      );

      // Capa frontal (Luz/Highlight)
      graphics.fillStyle(leavesColorLight, 0.8);
      graphics.fillCircle(
        x - radius * 0.3,
        bottomY - trunkHeight - radius * 1.2,
        radius * 0.6,
      );
      graphics.fillCircle(
        x + radius * 0.3,
        bottomY - trunkHeight - radius * 0.8,
        radius * 0.5,
      );
    };

    // Dibujar árboles en el escenario
    drawTree(80, 455, 1.2); // Izquierda primer plano
    drawTree(900, 445, 1.0); // Derecha
    drawTree(400, 438, 0.8); // Fondo medio
    drawTree(700, 438, 0.9); // Fondo medio

    // Arbustos decorativos
    graphics.fillStyle(0x16a34a, 1);
    graphics.fillCircle(350, 450, 20);
    graphics.fillCircle(380, 460, 25);
    graphics.fillCircle(330, 460, 15);
  }

  createStreetLamp() {
    this.lamp = this.add.graphics();
    this.drawStreetlight(this.lamp, 500, 300, false);
  }

  drawStreetlight(graphics, x, y, isOn) {
    graphics.clear();
    graphics.x = x;
    graphics.y = y;

    // --- Estilo Victoriano/Clásico Mejorado ---

    // 1. Base decorativa (Pedestal)
    graphics.fillStyle(0x1a1a1a, 1); // Negro casi puro
    // Base escalonada
    graphics.fillRoundedRect(-25, 140, 50, 10, 2);
    graphics.fillRoundedRect(-20, 130, 40, 10, 2);
    // Cuerpo de la base
    graphics.fillTriangle(-15, 130, 15, 130, 0, 100);

    // 2. Poste principal (Columna acanalada)
    graphics.fillStyle(0x2d2d2d, 1); // Gris oscuro metalizado
    // Sección inferior más gruesa
    graphics.fillRect(-8, 80, 16, 50);
    // Anillo decorativo
    graphics.fillStyle(0x424242, 1);
    graphics.fillRect(-10, 75, 20, 5);
    // Sección superior más delgada
    graphics.fillStyle(0x2d2d2d, 1);
    graphics.fillRect(-6, 0, 12, 75);

    // Detalles verticales (estrías)
    graphics.lineStyle(1, 0x000000, 0.5);
    graphics.beginPath();
    graphics.moveTo(-2, 0);
    graphics.lineTo(-2, 130);
    graphics.moveTo(2, 0);
    graphics.lineTo(2, 130);
    graphics.strokePath();

    // 3. Brazo decorativo (Voluta)
    graphics.lineStyle(4, 0x1a1a1a);
    const armPath = new Phaser.Curves.Path(0, 10);
    // Curva elegante hacia la izquierda
    armPath.cubicBezierTo(-30, 10, -40, -20, -60, -20);
    armPath.draw(graphics);

    // Soporte inferior del brazo (Scrollwork/Adorno)
    graphics.lineStyle(2, 0x1a1a1a);
    const decorPath = new Phaser.Curves.Path(0, 40);
    decorPath.quadraticBezierTo(-20, 40, -30, 10);
    decorPath.draw(graphics);

    // 4. Cabeza de la lámpara (Farol Hexagonal)
    // Posición del farol: al final del brazo (-60, -20)
    const lampX = -60;
    const lampY = -20;

    // Techo del farol
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillTriangle(
      lampX - 25,
      lampY - 30,
      lampX + 25,
      lampY - 30,
      lampX,
      lampY - 55,
    );
    // Remate superior (Pico)
    graphics.fillCircle(lampX, lampY - 55, 3);

    // Estructura del farol
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRect(lampX - 20, lampY - 30, 40, 5); // Borde superior
    graphics.fillRect(lampX - 15, lampY + 20, 30, 5); // Borde inferior

    // Vidrio
    if (isOn) {
      // Color encendido (Amarillo cálido)
      graphics.fillStyle(0xffeb3b, 0.9);
      graphics.fillRect(lampX - 18, lampY - 25, 36, 45);

      // Efecto de brillo interior (Núcleo blanco)
      graphics.fillStyle(0xffffff, 0.8);
      graphics.fillCircle(lampX, lampY, 8);

      // Haz de luz (Cono volumétrico)
      graphics.fillStyle(0xffff00, 0.2); // Luz suave
      graphics.beginPath();
      graphics.moveTo(lampX - 15, lampY + 25);
      graphics.lineTo(lampX + 15, lampY + 25);
      graphics.lineTo(lampX + 60, 250); // Proyección al suelo
      graphics.lineTo(lampX - 60, 250);
      graphics.closePath();
      graphics.fillPath();

      // Haz central más intenso
      graphics.fillStyle(0xffff00, 0.1);
      graphics.beginPath();
      graphics.moveTo(lampX - 10, lampY + 25);
      graphics.lineTo(lampX + 10, lampY + 25);
      graphics.lineTo(lampX + 30, 250);
      graphics.lineTo(lampX - 30, 250);
      graphics.closePath();
      graphics.fillPath();

      // Resplandor en el suelo (Ovalo)
      graphics.fillStyle(0xffff00, 0.3);
      graphics.fillEllipse(lampX, 250, 100, 20);
    } else {
      // Color apagado (Azul grisáceo)
      graphics.fillStyle(0x455a64, 0.6);
      graphics.fillRect(lampX - 18, lampY - 25, 36, 45);

      // Reflejo diagonal en el vidrio (Detalle de realismo)
      graphics.lineStyle(2, 0xffffff, 0.3);
      graphics.lineBetween(lampX - 10, lampY - 15, lampX + 10, lampY - 5);
    }

    // Marcos verticales del farol (Rejas)
    graphics.lineStyle(2, 0x1a1a1a);
    graphics.strokeRect(lampX - 18, lampY - 25, 36, 45);
    graphics.lineBetween(lampX, lampY - 25, lampX, lampY + 20); // Barra central
  }

  createDetailedBench() {
    const bench = this.add.graphics();
    const x = 700;
    const y = 430;

    // Sombra del banco
    bench.fillStyle(0x000000, 0.4);
    bench.fillEllipse(x + 90, y + 55, 200, 20);

    // Patas de hierro fundido (Estilo ornamental)
    bench.fillStyle(0x1a1a1a, 1);

    // Función para dibujar una pata lateral
    const drawLeg = (lx, ly) => {
      const path = new Phaser.Curves.Path(lx, ly);
      path.cubicBezierTo(lx - 20, ly + 20, lx - 20, ly + 40, lx - 10, ly + 50); // Pata delantera
      path.lineTo(lx + 10, ly + 50);
      path.cubicBezierTo(lx, ly + 40, lx, ly + 20, lx + 20, ly);
      path.closePath();
      bench.fillPoints(path.getPoints());

      // Respaldo de la pata
      const backPath = new Phaser.Curves.Path(lx + 20, ly - 20);
      backPath.cubicBezierTo(lx + 10, ly, lx + 10, ly + 30, lx + 20, ly + 50); // Pata trasera
      backPath.lineTo(lx + 40, ly + 50);
      backPath.cubicBezierTo(lx + 30, ly + 30, lx + 30, ly, lx + 40, ly - 20);
      backPath.closePath();
      bench.fillPoints(backPath.getPoints());
    };

    drawLeg(x, y);
    drawLeg(x + 160, y);

    // Listones de madera (Con textura y volumen)
    const plankColor = 0x8d6e63;
    const plankDark = 0x5d4037;

    // Asiento
    for (let i = 0; i < 4; i++) {
      // Cara superior
      bench.fillStyle(plankColor, 1);
      bench.fillRoundedRect(x - 10, y + i * 10, 200, 8, 2);
      // Canto/Sombra
      bench.fillStyle(plankDark, 1);
      bench.fillRect(x - 10, y + i * 10 + 6, 200, 2);
    }

    // Respaldo
    for (let i = 0; i < 3; i++) {
      // Cara frontal
      bench.fillStyle(plankColor, 1);
      bench.fillRoundedRect(x - 10, y - 30 + i * 10, 200, 8, 2);
      // Canto/Sombra
      bench.fillStyle(plankDark, 1);
      bench.fillRect(x - 10, y - 30 + i * 10 + 6, 200, 2);
    }

    // Remaches/Tornillos
    bench.fillStyle(0x3e2723, 1);
    for (let i = 0; i < 4; i++) {
      bench.fillCircle(x + 10, y + 4 + i * 10, 2);
      bench.fillCircle(x + 170, y + 4 + i * 10, 2);
    }
    for (let i = 0; i < 3; i++) {
      bench.fillCircle(x + 10, y - 26 + i * 10, 2);
      bench.fillCircle(x + 170, y - 26 + i * 10, 2);
    }
  }

  createBackgroundCharacter() {
    // Personaje sentado en el banco (Detallado y a color)
    const char = this.add.container(780, 425); // Usar container para agrupar partes

    // Gráficos para el cuerpo
    const body = this.add.graphics();
    char.add(body);

    // Paleta de colores (Estilo urbano nocturno)
    const skinColor = 0xe0ac69; // Piel
    const jacketColor = 0x37474f; // Chaqueta gris azulada
    const pantsColor = 0x263238; // Pantalones oscuros
    const shoeColor = 0x212121; // Zapatos negros
    const hatColor = 0xb71c1c; // Gorra roja (acento de color)
    const hairColor = 0x3e2723; // Pelo castaño

    // 1. Piernas (Sentado con piernas cruzadas)
    // Pierna izquierda (base)
    body.fillStyle(pantsColor, 1);
    const legL = new Phaser.Curves.Path(0, 10);
    legL.lineTo(20, 10); // Muslo
    legL.lineTo(20, 45); // Pantorrilla
    legL.lineTo(25, 45); // Tobillo
    legL.lineTo(5, 15); // Interior
    legL.closePath();
    body.fillPoints(legL.getPoints());

    // Zapato izquierdo
    body.fillStyle(shoeColor, 1);
    body.fillRoundedRect(20, 45, 25, 10, 3);
    body.fillStyle(0x424242, 1); // Suela
    body.fillRect(20, 53, 25, 2);

    // Pierna derecha (cruzada sobre la izquierda)
    body.fillStyle(pantsColor, 1); // Sombra ligera
    const legR = new Phaser.Curves.Path(0, 10);
    legR.lineTo(25, 5); // Muslo cruzado (sube)
    legR.lineTo(20, 30); // Pantorrilla colgando
    legR.lineTo(10, 15); // Interior
    legR.closePath();
    body.fillPoints(legR.getPoints());

    // Zapato derecho
    body.fillStyle(shoeColor, 1);
    body.fillRoundedRect(15, 30, 10, 20, 3); // Visto de frente/lado
    body.fillStyle(0x424242, 1); // Suela
    body.fillRect(15, 48, 10, 2);

    // 2. Torso (Chaqueta con volumen)
    body.fillStyle(jacketColor, 1);
    const torsoPath = new Phaser.Curves.Path(0, 15);
    torsoPath.lineTo(0, -30); // Espalda recta
    torsoPath.quadraticBezierTo(10, -35, 20, -30); // Hombros
    torsoPath.lineTo(15, 15); // Pecho
    torsoPath.closePath();
    body.fillPoints(torsoPath.getPoints());

    // Detalles chaqueta (Pliegues/Cremallera)
    body.lineStyle(2, 0x263238, 0.5);
    body.lineBetween(10, -30, 10, 15); // Cremallera
    body.lineStyle(1, 0x263238, 0.3);
    body.lineBetween(5, 0, 15, 5); // Pliegue

    // 3. Cabeza (Perfil detallado)
    const headGroup = this.add.container(10, -35); // Grupo para animar cabeza
    char.add(headGroup);
    const headGfx = this.add.graphics();
    headGroup.add(headGfx);

    // Cuello
    headGfx.fillStyle(skinColor, 1);
    headGfx.fillRect(-3, 0, 6, 8);

    // Cabeza base
    headGfx.fillStyle(skinColor, 1);
    headGfx.fillCircle(0, -8, 9);

    // Pelo (Flequillo asomando)
    headGfx.fillStyle(hairColor, 1);
    headGfx.fillCircle(-2, -10, 9);

    // Gorra
    headGfx.fillStyle(hatColor, 1);
    headGfx.beginPath();
    headGfx.arc(0, -12, 9, Math.PI, 0, false); // Copa
    headGfx.fillPath();
    headGfx.fillRect(-10, -12, 12, 4); // Visera hacia atrás o lado

    // Cara (Perfil)
    // Ojo (Punto simple pero expresivo)
    headGfx.fillStyle(0x3e2723, 1);
    headGfx.fillCircle(-4, -8, 1);

    // 4. Brazo (Apoyado relajado)
    const armGfx = this.add.graphics();
    char.add(armGfx); // Separado para capa superior

    armGfx.fillStyle(jacketColor, 1); // Manga
    const armPath = new Phaser.Curves.Path(15, -25); // Hombro
    armPath.quadraticBezierTo(25, -10, 20, 10); // Codo/Antebrazo
    armPath.lineTo(15, 10); // Muñeca
    armPath.lineTo(10, -20); // Axila
    armPath.closePath();
    armGfx.fillPoints(armPath.getPoints());

    // Mano (Piel)
    armGfx.fillStyle(skinColor, 1);
    armGfx.fillCircle(18, 12, 3.5); // Mano sobre pierna

    // Animación de respiración (Torso y cabeza se mueven sutilmente)
    this.tweens.add({
      targets: [headGroup, armGfx],
      y: "+=1", // Movimiento vertical muy leve
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.tweens.add({
      targets: body,
      scaleY: 1.02, // Expansión del pecho
      y: "-=0.5",
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Partículas de "frio" o "pensamiento" (vaho)
    const breath = this.add.graphics();
    char.add(breath);
    breath.fillStyle(0xffffff, 0.15);
    breath.fillCircle(-5, -40, 2);

    this.tweens.add({
      targets: breath,
      x: -15,
      y: -45,
      alpha: { from: 0.2, to: 0 },
      scale: { from: 1, to: 2.5 },
      duration: 2000,
      repeat: -1,
      delay: 500,
    });
  }

  createDraggables() {
    // Panel Solar
    this.panelItem = this.createSolarPanel(100, 150);
    this.panelItem.setInteractive();
    this.input.setDraggable(this.panelItem);
    this.panelItem.setData("type", "solar_panel");

    // Batería
    this.batteryItem = this.createBattery(100, 300);
    this.batteryItem.setInteractive();
    this.input.setDraggable(this.batteryItem);
    this.batteryItem.setData("type", "battery");
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
    // Fondo base
    gfx.fillStyle(0x0d47a1, 1);
    gfx.fillRoundedRect(-46, -31, 92, 62, 2);

    // Gradiente para efecto de cristal
    gfx.fillGradientStyle(0x1565c0, 0x0d47a1, 0x002171, 0x002171, 0.8);
    gfx.fillRect(-46, -31, 92, 62);

    // 4. Grid de celdas (Busbars finos)
    gfx.lineStyle(1, 0x90caf9, 0.3);

    // Líneas verticales (separación de celdas)
    const cellWidth = 92 / 4;
    for (let i = 1; i < 4; i++) {
      gfx.beginPath();
      gfx.moveTo(-46 + i * cellWidth, -31);
      gfx.lineTo(-46 + i * cellWidth, 31);
      gfx.strokePath();
    }

    // Líneas horizontales (separación de celdas)
    const cellHeight = 62 / 3;
    for (let i = 1; i < 3; i++) {
      gfx.beginPath();
      gfx.moveTo(-46, -31 + i * cellHeight);
      gfx.lineTo(46, -31 + i * cellHeight);
      gfx.strokePath();
    }

    // Busbars principales (Conductores plateados más gruesos)
    gfx.lineStyle(2, 0xc0c0c0, 0.6);
    gfx.beginPath();
    gfx.moveTo(-23, -31);
    gfx.lineTo(-23, 31);
    gfx.moveTo(23, -31);
    gfx.lineTo(23, 31);
    gfx.strokePath();

    // 5. Reflejo especular (Cristal templado)
    gfx.fillStyle(0xffffff, 0.15);
    gfx.beginPath();
    gfx.moveTo(-46, -31);
    gfx.lineTo(-20, -31);
    gfx.lineTo(-46, 0);
    gfx.closePath();
    gfx.fillPath();

    gfx.fillStyle(0xffffff, 0.05);
    gfx.beginPath();
    gfx.moveTo(20, 31);
    gfx.lineTo(46, 31);
    gfx.lineTo(46, 0);
    gfx.closePath();
    gfx.fillPath();

    // 6. Caja de conexiones (Reverso visible o detalle de montaje)
    gfx.fillStyle(0x424242, 1);
    gfx.fillRoundedRect(-15, 37, 30, 10, 2); // Conector inferior

    // Cables positivo/negativo
    gfx.lineStyle(2, 0xf44336); // Rojo
    gfx.lineBetween(-10, 42, -10, 50);
    gfx.lineStyle(2, 0x2196f3); // Azul
    gfx.lineBetween(10, 42, 10, 50);

    panelContainer.setSize(104, 74);
    return panelContainer;
  }

  createBattery(x, y) {
    const batteryContainer = this.add.container(x, y);
    const gfx = this.add.graphics();
    batteryContainer.add(gfx);

    // Estilo High-Tech Industrial (Gris oscuro metalizado y Neon)

    // 1. Carcasa principal
    gfx.fillStyle(0x37474f, 1); // Gris azulado oscuro
    gfx.fillRoundedRect(-35, -45, 70, 90, 6);

    // Textura metálica (líneas finas)
    gfx.lineStyle(1, 0x455a64, 0.3);
    for (let i = 0; i < 90; i += 4) {
      gfx.lineBetween(-35, -45 + i, 35, -45 + i);
    }

    // Bordes reforzados (Bumpers)
    gfx.fillStyle(0x263238, 1);
    gfx.fillRoundedRect(-38, -48, 76, 10, 4); // Top
    gfx.fillRoundedRect(-38, 38, 76, 10, 4); // Bottom

    // 2. Pantalla Digital LCD
    gfx.fillStyle(0x000000, 1);
    gfx.fillRoundedRect(-25, -25, 50, 30, 2);

    // Brillo pantalla
    gfx.fillStyle(0x212121, 1);
    gfx.fillRect(-25, -25, 50, 15); // Mitad superior más clara

    // Texto digital "100%" (Simulado con rectángulos o texto real si es posible, pero usaremos gráficos para mantener estilo vector)
    // Usaremos un texto pequeño de Phaser añadido al container
    const voltageText = this.add
      .text(0, -10, "12.8V", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#00e676",
      })
      .setOrigin(0.5);
    batteryContainer.add(voltageText);

    // Icono de carga (Rayo)
    const bolt = this.add.graphics();
    batteryContainer.add(bolt);
    bolt.fillStyle(0xffeb3b, 1);
    bolt.beginPath();
    bolt.moveTo(15, -20);
    bolt.lineTo(20, -20);
    bolt.lineTo(17, -15);
    bolt.lineTo(21, -15);
    bolt.lineTo(16, -8);
    bolt.lineTo(18, -13);
    bolt.lineTo(15, -13);
    bolt.closePath();
    bolt.fillPath();

    // Animación del rayo (Parpadeo)
    this.tweens.add({
      targets: bolt,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // 3. Barra de Estado (LEDs dinámicos)
    gfx.fillStyle(0x1b5e20, 1); // Fondo barra
    gfx.fillRoundedRect(-25, 15, 50, 8, 2);

    // Segmentos iluminados
    const createSegment = (index) => {
      const seg = this.add.graphics();
      batteryContainer.add(seg);
      seg.fillStyle(0x00e676, 1);
      seg.fillRect(-23 + index * 10, 17, 8, 4);

      // Animación de carga (secuencial)
      this.tweens.add({
        targets: seg,
        alpha: { from: 0.2, to: 1 },
        duration: 300,
        delay: index * 200,
        yoyo: true,
        repeat: -1,
      });
    };

    for (let i = 0; i < 5; i++) {
      createSegment(i);
    }

    // 4. Conectores Inferiores (Bornes)
    // Positivo (Rojo)
    gfx.fillStyle(0xd32f2f, 1);
    gfx.fillCircle(-15, 43, 6);
    gfx.fillStyle(0xb71c1c, 1); // Núcleo
    gfx.fillCircle(-15, 43, 3);

    // Negativo (Azul/Negro)
    gfx.fillStyle(0x1976d2, 1);
    gfx.fillCircle(15, 43, 6);
    gfx.fillStyle(0x0d47a1, 1); // Núcleo
    gfx.fillCircle(15, 43, 3);

    // Símbolos
    gfx.lineStyle(2, 0xffffff, 0.8);
    // +
    gfx.lineBetween(-18, 28, -12, 28);
    gfx.lineBetween(-15, 25, -15, 31);
    // -
    gfx.lineBetween(12, 28, 18, 28);

    batteryContainer.setSize(70, 90);
    return batteryContainer;
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

    // Lógica secuencial: Panel -> Batería
    if (!this.isPanelPlaced) {
      target = this.panelItem;
      // Destino: Zona de caída del panel (dropZonePanel)
      dest = { x: this.dropZonePanel.x, y: this.dropZonePanel.y };
    } else if (!this.isBatteryPlaced) {
      target = this.batteryItem;
      // Destino: Zona de caída de la batería (dropZoneBattery)
      dest = { x: this.dropZoneBattery.x, y: this.dropZoneBattery.y };
    }

    if (target && dest) {
      this.hand.setVisible(true);
      // Posición inicial: Sobre el objeto
      this.hand.setPosition(target.x, target.y);
      this.hand.setAlpha(1);
      this.hand.setScale(1);
      this.hand.setDepth(200); // Asegurar que se vea encima

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
    // Estrellas parpadeantes
    for (let i = 0; i < 40; i++) {
      const star = this.add.circle(
        Math.random() * 1000,
        Math.random() * 250,
        Math.random() * 1.5 + 0.5,
        0xffffff,
      );
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: 500 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
      });
    }

    // Luciérnagas
    for (let i = 0; i < 10; i++) {
      const firefly = this.add.circle(0, 0, 3, 0xcddc39); // Verde lima
      const fCont = this.add.container(
        Math.random() * 1000,
        350 + Math.random() * 150,
        [firefly],
      );

      this.tweens.add({
        targets: fCont,
        x: { from: fCont.x, to: fCont.x + (Math.random() * 200 - 100) },
        y: { from: fCont.y, to: fCont.y + (Math.random() * 100 - 50) },
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      this.tweens.add({
        targets: firefly,
        alpha: 0.3,
        duration: 500 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  drawMoon(x, y, radius) {
    const moon = this.add.graphics();

    // Color base de la luna
    moon.fillStyle(0xcfd8dc, 1); // Gris claro
    moon.fillCircle(x, y, radius);

    // Cráteres (simulados con círculos más oscuros y variados)
    moon.fillStyle(0xb0bec5, 1); // Gris un poco más oscuro
    moon.fillCircle(x - radius * 0.4, y - radius * 0.3, radius * 0.2);
    moon.fillCircle(x + radius * 0.5, y + radius * 0.1, radius * 0.15);
    moon.fillCircle(x - radius * 0.1, y + radius * 0.5, radius * 0.25);
    moon.fillCircle(x + radius * 0.2, y - radius * 0.6, radius * 0.1); // Nuevo cráter
    moon.fillCircle(x - radius * 0.6, y + radius * 0.1, radius * 0.18); // Nuevo cráter

    // Sombreado sutil para dar volumen
    moon.fillStyle(0x90a4ae, 0.3); // Gris azulado semitransparente
    moon.fillCircle(x + radius * 0.3, y + radius * 0.3, radius * 0.8);

    // Borde suave (opcional)
    moon.lineStyle(2, 0x90a4ae, 0.5);
    moon.strokeCircle(x, y, radius);

    return moon;
  }

  createBurst(x, y) {
    for (let i = 0; i < 12; i++) {
      const color = Phaser.Utils.Array.GetRandom([
        0xffff00, 0xffffff, 0x4caf50,
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
    if (this.isPanelPlaced && this.isBatteryPlaced) {
      this.hand.setVisible(false); // Ocultar mano al ganar
      this.lightUpStreet();
    } else {
      // Si falta algo, seguir mostrando la ayuda
      this.time.delayedCall(500, () => this.showHint());
    }
  }

  lightUpStreet() {
    // Conectar cables visualmente
    const wires = this.add.graphics();
    wires.lineStyle(3, 0xffff00);

    const path1 = new Phaser.Curves.Path(200, 115);
    path1.lineTo(200, this.dropZoneBattery.y);
    path1.draw(wires);

    // Encender luz
    this.drawStreetlight(this.lamp, 500, 300, true);

    // Animación de parpadeo inicial
    this.tweens.add({
      targets: this.lamp,
      alpha: 0.8,
      yoyo: true,
      duration: 100,
      repeat: 2,
    });

    this.showWinAnimation();
  }

  showWinAnimation() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fondo oscurecido para resaltar
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setOrigin(0, 0);
    overlay.setAlpha(0);

    this.tweens.add({
      targets: overlay,
      alpha: 0.8,
      duration: 1000,
    });

    // Texto de Felicitaciones
    const winText = this.add
      .text(width / 2, height / 2 - 50, "¡GENIAL!\nNIVEL 3 COMPLETADO", {
        fontFamily: "Arial",
        fontSize: "48px",
        color: "#ffd700",
        align: "center",
        stroke: "#000000",
        strokeThickness: 6,
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: "#000",
          blur: 5,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setScale(0);

    // Animación de entrada del texto
    this.tweens.add({
      targets: winText,
      scale: 1,
      duration: 1000,
      ease: "Elastic.out",
      delay: 500,
    });

    // Botón "Volver a jugar"
    const restartBtn = this.add.container(width / 2, height / 2 + 100);
    restartBtn.setAlpha(0);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x4caf50, 1);
    btnBg.fillRoundedRect(-120, -30, 240, 60, 15);
    btnBg.lineStyle(3, 0xffffff, 1);
    btnBg.strokeRoundedRect(-120, -30, 240, 60, 15);

    const btnText = this.add
      .text(0, 0, "Ir al Puzzle 4", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    restartBtn.add([btnBg, btnText]);

    // Interacción del botón
    restartBtn.setInteractive(
      new Phaser.Geom.Rectangle(-120, -30, 240, 60),
      Phaser.Geom.Rectangle.Contains,
    );

    restartBtn.on("pointerover", () => {
      this.tweens.add({
        targets: restartBtn,
        scale: 1.1,
        duration: 100,
      });
      btnBg.clear();
      btnBg.fillStyle(0x66bb6a, 1);
      btnBg.fillRoundedRect(-120, -30, 240, 60, 15);
      btnBg.lineStyle(3, 0xffffff, 1);
      btnBg.strokeRoundedRect(-120, -30, 240, 60, 15);
    });

    restartBtn.on("pointerout", () => {
      this.tweens.add({
        targets: restartBtn,
        scale: 1,
        duration: 100,
      });
      btnBg.clear();
      btnBg.fillStyle(0x4caf50, 1);
      btnBg.fillRoundedRect(-120, -30, 240, 60, 15);
      btnBg.lineStyle(3, 0xffffff, 1);
      btnBg.strokeRoundedRect(-120, -30, 240, 60, 15);
    });

    restartBtn.on("pointerdown", () => {
      this.cameras.main.fade(1500, 0, 0, 0, false, (camera, progress) => {
        if (progress === 1) {
          this.scene.start("Puzzle4Scene");
        }
      });
    });

    // Animación de entrada del botón
    this.tweens.add({
      targets: restartBtn,
      alpha: 1,
      y: height / 2 + 80, // Pequeño movimiento hacia arriba
      duration: 800,
      ease: "Power2",
      delay: 1500,
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
        // Más fuegos artificiales aleatorios mientras espera
        {
          targets: overlay,
          duration: 1000,
          repeat: 4,
          onComplete: () => {
            this.createFirework(
              width * 0.1 + Math.random() * width * 0.8,
              height * 0.1 + Math.random() * height * 0.5,
              Phaser.Utils.Array.GetRandom([
                0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x00ffff, 0xff00ff,
              ]),
            );
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
