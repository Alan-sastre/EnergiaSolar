export default class PresentacionScene extends Phaser.Scene {
  constructor() {
    super({ key: "PresentacionScene" });
  }

  create() {
    this.paginaActual = 0;
    this.datosDiapositivas = [
      {
        titulo: "EL SOL ☀️",
        texto: [
          "• Es una estrella gigante de fuego",
          "• Nos da luz y calor todos los días",
          "• Está muy lejos de la Tierra",
          "• ¡Sin el Sol no habría vida!",
        ],
        tipo: "sol",
      },
      {
        titulo: "PANELES SOLARES 🟦",
        texto: [
          "• Son como 'hojas' tecnológicas",
          "• Atrapan la luz del Sol",
          "• Convierten la luz en electricidad",
          "• Se colocan en los techos",
        ],
        tipo: "panel",
      },
      {
        titulo: "EL PROCESO ⚡",
        texto: [
          "1. El Sol brilla sobre el panel",
          "2. El panel crea electricidad",
          "3. Los cables la llevan a casa",
          "4. ¡Y encienden tus focos!",
        ],
        tipo: "diagrama",
      },
      {
        titulo: "¿POR QUÉ ES BUENO? 🌍",
        texto: [
          "✓ No contamina el aire",
          "✓ Es energía infinita",
          "✓ Cuida a los animales y plantas",
          "✓ ¡El Sol es gratis!",
        ],
        tipo: "planeta",
      },
      {
        titulo: "¡TU MISIÓN! 🚀",
        texto: [
          "La casa necesita energía limpia",
          "Tu trabajo es instalar los paneles",
          "1. Responde las preguntas",
          "2. Demuestra lo que aprendiste",
          "3. ¡Gana estrellas!",
        ],
        tipo: "mision",
      },
    ];

    this.totalPaginas = this.datosDiapositivas.length;
    this.elementosPagina = [];

    this.crearFondo();
    this.crearMarcoPagina();
    this.crearControles();
    this.mostrarPagina(0);
  }

  crearFondo() {
    // Cielo gradiente
    const cielo = this.add.graphics();
    cielo.fillGradientStyle(0x4FC3F7, 0x4FC3F7, 0xB3E5FC, 0xE1F5FE, 1);
    cielo.fillRect(0, 0, 1000, 500);
    
    // Pasto detallado
    this.add.rectangle(500, 480, 1000, 100, 0x7CB342);
    
    // Hierba decorativa
    for (let i = 0; i < 30; i++) {
      const x = 20 + i * 33;
      const h = 8 + Math.random() * 12;
      this.add.triangle(x, 485, -2, 0, 0, -h, 2, 0, 0x558B2F);
    }

    // Árboles decorativos
    this.crearArbol(70, 465);
    this.crearArbol(930, 465);

    // Sol decorativo animado
    this.crearSolDecorativo(900, 80);

    // Nubes animadas
    for (let i = 0; i < 4; i++) {
      this.crearNubeAnimada(100 + i * 250, 60 + Math.random() * 50, i * 1000);
    }
  }

  crearArbol(x, y) {
    const arbol = this.add.container(x, y);
    arbol.add(this.add.rectangle(0, 25, 14, 48, 0x5D4037));
    arbol.add(this.add.circle(0, -8, 32, 0x2E7D32));
    arbol.add(this.add.circle(-14, -2, 26, 0x388E3C));
    arbol.add(this.add.circle(14, -2, 26, 0x388E3C));
    arbol.add(this.add.circle(0, -22, 28, 0x43A047));
  }

  crearSolDecorativo(x, y) {
    const sol = this.add.container(x, y);
    
    for (let i = 3; i >= 1; i--) {
      const glow = this.add.circle(0, 0, 55 + i * 8, 0xFFEB3B, 0.15);
      sol.add(glow);
      this.tweens.add({
        targets: glow,
        scale: 1.15,
        alpha: 0.3,
        duration: 2000 + i * 400,
        yoyo: true,
        repeat: -1
      });
    }
    
    for (let i = 0; i < 12; i++) {
      const rayo = this.add.rectangle(0, -48, 5, 22, 0xFFD54F, 0.8);
      rayo.setAngle(i * 30);
      sol.add(rayo);
    }
    
    sol.add(this.add.circle(0, 0, 32, 0xFFD54F));
    sol.add(this.add.circle(0, 0, 25, 0xFFEE58));
    
    sol.add(this.add.ellipse(-10, -4, 10, 13, 0x3E2723));
    sol.add(this.add.ellipse(10, -4, 10, 13, 0x3E2723));
    sol.add(this.add.circle(-10, -5, 4, 0xFFFFFF));
    sol.add(this.add.circle(10, -5, 4, 0xFFFFFF));
    const sonrisa = this.add.graphics();
    sonrisa.lineStyle(3, 0x3E2723);
    sonrisa.beginPath();
    sonrisa.arc(0, 5, 13, 0.3, 2.8);
    sonrisa.strokePath();
    sol.add(sonrisa);

    this.tweens.add({
      targets: sol,
      angle: 360,
      duration: 25000,
      repeat: -1,
      ease: "Linear"
    });
  }

  crearNubeAnimada(x, y, delay) {
    const nube = this.add.container(x, y);
    nube.add(this.add.ellipse(-22, 3, 38, 26, 0xFFFFFF));
    nube.add(this.add.ellipse(0, -6, 48, 36, 0xFFFFFF));
    nube.add(this.add.ellipse(22, 3, 38, 26, 0xFFFFFF));
    nube.add(this.add.ellipse(0, 10, 32, 22, 0xFFFFFF));

    this.tweens.add({
      targets: nube,
      x: x + 30,
      duration: 7000,
      yoyo: true,
      repeat: -1,
      delay: delay
    });
  }

  crearMarcoPagina() {
    this.add.rectangle(500, 260, 800, 350, 0xffffff, 0.95).setStrokeStyle(5, 0xffb74d);
  }

  crearControles() {
    this.indicadores = [];
    for (let i = 0; i < this.totalPaginas; i++) {
      const circle = this.add.circle(440 + i * 30, 460, 8, 0xbdbdbd);
      this.indicadores.push(circle);
    }

    // Crear botón de atrás con diseño mejorado
    this.btnAnt = this.crearBotonAtras(150, 460);
    this.btnSig = this.crearBotonSiguiente(850, 460);

    this.btnAnt.on("pointerdown", () => this.cambiarPagina(-1));
    this.btnSig.on("pointerdown", () => this.cambiarPagina(1));

    this.actualizarControles();
  }

  crearBotonAtras(x, y) {
    const container = this.add.container(x, y);
    const ancho = 140;
    const alto = 52;

    // Sombra del botón
    const sombra = this.add.rectangle(4, 4, ancho, alto, 0x000000, 0.25);
    
    // Fondo del botón con gradiente simulado
    const bg = this.add.rectangle(0, 0, ancho, alto, 0xFF7043);
    bg.setStrokeStyle(3, 0xFFFFFF);
    
    // Efecto de brillo superior
    const brillo = this.add.rectangle(0, -alto/4, ancho - 6, alto/3, 0xFFFFFF, 0.2);
    
    // Círculo decorativo para la flecha
    const circuloIcono = this.add.circle(-45, 0, 18, 0xFFFFFF, 0.3);
    
    // Flecha con estilo moderno
    const flecha = this.add.text(-45, 0, "←", {
      fontSize: "28px",
      fontFamily: "Arial",
      color: "#FFFFFF",
      fontStyle: "bold"
    }).setOrigin(0.5);
    
    // Texto del botón
    const txt = this.add.text(15, 0, "ATRÁS", {
      fontSize: "20px",
      fontFamily: "Fredoka One",
      color: "#FFFFFF",
      fontStyle: "bold"
    }).setOrigin(0.5);

    container.add([sombra, bg, brillo, circuloIcono, flecha, txt]);
    container.setSize(ancho, alto);
    container.setInteractive(new Phaser.Geom.Rectangle(-ancho/2, -alto/2, ancho, alto), Phaser.Geom.Rectangle.Contains);

    // Animación idle suave
    this.tweens.add({
      targets: flecha,
      x: -48,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    container.on("pointerover", () => {
      bg.setFillStyle(0xFF8A65);
      this.tweens.add({ 
        targets: container, 
        scaleX: 1.08, 
        scaleY: 1.08, 
        duration: 150,
        ease: "Back.easeOut"
      });
      this.tweens.add({
        targets: circuloIcono,
        scale: 1.2,
        duration: 150
      });
    });
    
    container.on("pointerout", () => {
      bg.setFillStyle(0xFF7043);
      this.tweens.add({ 
        targets: container, 
        scaleX: 1, 
        scaleY: 1, 
        duration: 150,
        ease: "Power2"
      });
      this.tweens.add({
        targets: circuloIcono,
        scale: 1,
        duration: 150
      });
    });
    
    container.on("pointerdown", () => {
      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 80,
        yoyo: true
      });
    });

    return container;
  }

  crearBotonSiguiente(x, y) {
    const container = this.add.container(x, y);
    const ancho = 160;
    const alto = 52;

    // Sombra del botón
    const sombra = this.add.rectangle(4, 4, ancho, alto, 0x000000, 0.25);
    
    // Fondo del botón
    const bg = this.add.rectangle(0, 0, ancho, alto, 0x66BB6A);
    bg.setStrokeStyle(3, 0xFFFFFF);
    
    // Efecto de brillo superior
    const brillo = this.add.rectangle(0, -alto/4, ancho - 6, alto/3, 0xFFFFFF, 0.2);
    
    // Círculo decorativo para la flecha
    const circuloIcono = this.add.circle(55, 0, 18, 0xFFFFFF, 0.3);
    
    // Flecha con estilo moderno
    const flecha = this.add.text(55, 0, "→", {
      fontSize: "28px",
      fontFamily: "Arial",
      color: "#FFFFFF",
      fontStyle: "bold"
    }).setOrigin(0.5);
    
    // Texto del botón
    const txt = this.add.text(-15, 0, "SIGUIENTE", {
      fontSize: "20px",
      fontFamily: "Fredoka One",
      color: "#FFFFFF",
      fontStyle: "bold"
    }).setOrigin(0.5);

    container.add([sombra, bg, brillo, circuloIcono, flecha, txt]);
    container.setSize(ancho, alto);
    container.setInteractive(new Phaser.Geom.Rectangle(-ancho/2, -alto/2, ancho, alto), Phaser.Geom.Rectangle.Contains);

    // Animación idle suave
    this.tweens.add({
      targets: flecha,
      x: 58,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    container.on("pointerover", () => {
      bg.setFillStyle(0x81C784);
      this.tweens.add({ 
        targets: container, 
        scaleX: 1.08, 
        scaleY: 1.08, 
        duration: 150,
        ease: "Back.easeOut"
      });
      this.tweens.add({
        targets: circuloIcono,
        scale: 1.2,
        duration: 150
      });
    });
    
    container.on("pointerout", () => {
      bg.setFillStyle(0x66BB6A);
      this.tweens.add({ 
        targets: container, 
        scaleX: 1, 
        scaleY: 1, 
        duration: 150,
        ease: "Power2"
      });
      this.tweens.add({
        targets: circuloIcono,
        scale: 1,
        duration: 150
      });
    });
    
    container.on("pointerdown", () => {
      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 80,
        yoyo: true
      });
    });

    return container;
  }

  actualizarControles() {
    this.indicadores.forEach((ind, i) => {
      ind.setFillStyle(i === this.paginaActual ? 0xff9800 : 0xbdbdbd);
    });

    this.btnAnt.setVisible(this.paginaActual > 0);

    // Los hijos del botón son: [sombra, bg, brillo, circuloIcono, flecha, txt]
    const txtSig = this.btnSig.list[5];
    const bgSig = this.btnSig.list[1];
    if (this.paginaActual === this.totalPaginas - 1) {
      txtSig.setText("¡JUGAR! 🎮");
      bgSig.setFillStyle(0xff5722);
    } else {
      txtSig.setText("SIGUIENTE ➡");
      bgSig.setFillStyle(0x66BB6A);
    }
  }

  cambiarPagina(delta) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.mostrarPagina(this.paginaActual);
      this.actualizarControles();
    } else if (nuevaPagina >= this.totalPaginas) {
      this.scene.start("PuzzleSolarScene");
    }
  }

  limpiarPagina() {
    this.elementosPagina.forEach((el) => el.destroy());
    this.elementosPagina = [];
  }

  mostrarPagina(indice) {
    this.limpiarPagina();
    const info = this.datosDiapositivas[indice];

    const titulo = this.add.text(500, 130, info.titulo, {
      fontSize: "38px",
      fontFamily: "Fredoka One",
      color: "#E65100",
      stroke: "#FFF9C4",
      strokeThickness: 4,
    }).setOrigin(0.5);
    this.elementosPagina.push(titulo);

    let yPos = 180;
    info.texto.forEach((linea) => {
      const t = this.add.text(420, yPos, linea, {
        fontSize: "22px",
        fontFamily: "Quicksand",
        color: "#37474F",
        wordWrap: { width: 450 },
      }).setOrigin(0, 0);
      this.elementosPagina.push(t);
      yPos += 40;
    });

    this.renderizarIlustracion(info.tipo);
  }

  renderizarIlustracion(tipo) {
    const x = 250;
    const y = 280;

    if (tipo === "sol") {
      // Sol elaborado con rayos animados
      const contenedor = this.add.container(x, y);
      
      for (let i = 0; i < 16; i++) {
        const rayo = this.add.rectangle(0, -65, 6, 30, 0xFFD54F, 0.8);
        rayo.setAngle(i * 22.5);
        contenedor.add(rayo);
        this.tweens.add({
          targets: rayo,
          scaleY: 1.4,
          alpha: 0.5,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          delay: i * 40
        });
      }
      
      contenedor.add(this.add.circle(0, 0, 50, 0xFF8F00));
      contenedor.add(this.add.circle(0, 0, 42, 0xFFA000));
      contenedor.add(this.add.circle(0, 0, 34, 0xFFC107));
      contenedor.add(this.add.circle(0, 0, 26, 0xFFD54F));
      
      contenedor.add(this.add.ellipse(-11, -5, 12, 16, 0x3E2723));
      contenedor.add(this.add.ellipse(11, -5, 12, 16, 0x3E2723));
      contenedor.add(this.add.circle(-11, -6, 5, 0xFFFFFF));
      contenedor.add(this.add.circle(11, -6, 5, 0xFFFFFF));
      const sonrisa = this.add.graphics();
      sonrisa.lineStyle(4, 0x3E2723);
      sonrisa.beginPath();
      sonrisa.arc(0, 6, 17, 0.3, 2.8);
      sonrisa.strokePath();
      contenedor.add(sonrisa);
      contenedor.add(this.add.circle(-18, 5, 8, 0xFF8A80, 0.5));
      contenedor.add(this.add.circle(18, 5, 8, 0xFF8A80, 0.5));
      
      this.tweens.add({
        targets: contenedor,
        angle: 360,
        duration: 50000,
        repeat: -1,
        ease: "Linear"
      });
      
      this.elementosPagina.push(contenedor);

    } else if (tipo === "panel") {
      // Panel solar detallado
      const contenedor = this.add.container(x, y);
      
      const marco = this.add.rectangle(0, 0, 130, 90, 0x1565C0);
      marco.setStrokeStyle(4, 0x0D47A1);
      contenedor.add(marco);
      
      for (let fila = 0; fila < 2; fila++) {
        for (let col = 0; col < 3; col++) {
          const cx = -42 + col * 42;
          const cy = -28 + fila * 56;
          const celda = this.add.rectangle(cx, cy, 36, 48, 0x1976D2);
          celda.setStrokeStyle(2, 0x0D47A1);
          contenedor.add(celda);
          
          for (let li = 1; li < 4; li++) {
            const linea = this.add.rectangle(cx, cy - 16 + li * 11, 32, 1, 0x0D47A1, 0.4);
            contenedor.add(linea);
          }
          
          const reflejo = this.add.rectangle(cx - 10, cy - 16, 14, 8, 0xFFFFFF, 0.4);
          contenedor.add(reflejo);
          
          this.tweens.add({
            targets: celda,
            fillColor: { from: 0x1976D2, to: 0x64B5F6 },
            duration: 1800,
            yoyo: true,
            repeat: -1,
            delay: (fila * 3 + col) * 200
          });
        }
      }
      
      const brillo = this.add.rectangle(0, -38, 110, 12, 0xFFFFFF, 0.5);
      contenedor.add(brillo);
      this.tweens.add({
        targets: brillo,
        alpha: { from: 0.3, to: 0.7 },
        duration: 1500,
        yoyo: true,
        repeat: -1
      });
      
      this.elementosPagina.push(contenedor);

    } else if (tipo === "diagrama") {
      // Diagrama animado
      const contenedor = this.add.container(x, y);
      
      const sol = this.add.container(0, -75);
      for (let i = 0; i < 8; i++) {
        const r = this.add.rectangle(0, -22, 3, 10, 0xFFD54F, 0.7);
        r.setAngle(i * 45);
        sol.add(r);
      }
      sol.add(this.add.circle(0, 0, 18, 0xFFEB3B));
      contenedor.add(sol);
      
      const flecha1 = this.add.container(0, -40);
      flecha1.add(this.add.rectangle(0, 0, 4, 28, 0x757575));
      flecha1.add(this.add.triangle(0, 16, -6, 0, 6, 0, 0, 10, 0x757575));
      contenedor.add(flecha1);
      
      const panel = this.add.container(0, -5);
      panel.add(this.add.rectangle(0, 0, 60, 42, 0x1565C0));
      panel.add(this.add.rectangle(0, 0, 50, 32, 0x1976D2));
      contenedor.add(panel);
      
      const flecha2 = this.add.container(0, 35);
      flecha2.add(this.add.rectangle(0, 0, 4, 28, 0x757575));
      flecha2.add(this.add.triangle(0, 16, -6, 0, 6, 0, 0, 10, 0x757575));
      contenedor.add(flecha2);
      
      const casa = this.add.container(0, 80);
      casa.add(this.add.rectangle(0, 10, 70, 50, 0xFFAB91));
      casa.add(this.add.triangle(0, -18, -38, 22, 0, -28, 38, 22, 0x8D6E63));
      const foco = this.add.circle(0, -45, 10, 0x808080);
      casa.add(foco);
      contenedor.add(casa);
      
      this.tweens.add({
        targets: [flecha1, flecha2],
        alpha: { from: 0.4, to: 1 },
        duration: 700,
        yoyo: true,
        repeat: -1
      });
      
      this.time.delayedCall(1500, () => {
        foco.setFillStyle(0xFFEB3B);
        this.tweens.add({
          targets: foco,
          scale: 1.5,
          duration: 300,
          yoyo: true
        });
      });
      
      this.elementosPagina.push(contenedor);

    } else if (tipo === "planeta") {
      // Planeta Tierra animado
      const contenedor = this.add.container(x, y);
      
      for (let i = 3; i >= 1; i--) {
        const glow = this.add.circle(0, 0, 55 + i * 6, 0x42A5F5, 0.2);
        contenedor.add(glow);
        this.tweens.add({
          targets: glow,
          scale: 1.1,
          alpha: 0.35,
          duration: 2000 + i * 400,
          yoyo: true,
          repeat: -1
        });
      }
      
      contenedor.add(this.add.circle(0, 0, 52, 0x1976D2));
      contenedor.add(this.add.ellipse(-16, -15, 28, 24, 0x2E7D32));
      contenedor.add(this.add.ellipse(20, -8, 26, 22, 0x388E3C));
      contenedor.add(this.add.ellipse(-2, 24, 32, 20, 0x43A047));
      contenedor.add(this.add.ellipse(-26, 6, 20, 18, 0x4CAF50));
      contenedor.add(this.add.ellipse(24, 14, 22, 20, 0x2E7D32));
      
      const nubes = [
        { x: -24, y: -22, rx: 22, ry: 11 },
        { x: 18, y: -26, rx: 20, ry: 10 },
        { x: 26, y: 4, rx: 18, ry: 9 },
        { x: -8, y: 24, rx: 24, ry: 12 }
      ];
      
      nubes.forEach((n, i) => {
        const nube = this.add.ellipse(n.x, n.y, n.rx, n.ry, 0xFFFFFF, 0.85);
        contenedor.add(nube);
        this.tweens.add({
          targets: nube,
          x: n.x + 8,
          duration: 4000 + i * 600,
          yoyo: true,
          repeat: -1
        });
      });
      
      const corazon = this.add.text(0, 62, "💚", { fontSize: "40px" }).setOrigin(0.5);
      contenedor.add(corazon);
      this.tweens.add({
        targets: corazon,
        scale: { from: 0.85, to: 1.3 },
        duration: 900,
        yoyo: true,
        repeat: -1
      });
      
      this.tweens.add({
        targets: contenedor,
        angle: 360,
        duration: 50000,
        repeat: -1,
        ease: "Linear"
      });
      
      this.elementosPagina.push(contenedor);

    } else if (tipo === "mision") {
      // Misión - panel y herramientas
      const contenedor = this.add.container(x, y);
      
      const panel = this.add.container(0, 0);
      panel.add(this.add.rectangle(0, 0, 100, 70, 0x1565C0));
      panel.add(this.add.rectangle(0, 0, 88, 58, 0x1976D2));
      for (let i = 0; i < 4; i++) {
        const cx = -33 + (i % 2) * 66;
        const cy = -22 + Math.floor(i / 2) * 44;
        panel.add(this.add.rectangle(cx, cy, 28, 36, 0x42A5F5));
      }
      contenedor.add(panel);
      
      const estrellas = this.add.container(0, -70);
      for (let i = 0; i < 3; i++) {
        const estrella = this.add.text(-30 + i * 30, 0, "⭐", { fontSize: "30px" }).setOrigin(0.5);
        estrellas.add(estrella);
        this.tweens.add({
          targets: estrella,
          scale: { from: 0.7, to: 1.2 },
          duration: 600 + i * 100,
          yoyo: true,
          repeat: -1,
          delay: i * 150
        });
      }
      contenedor.add(estrellas);
      
      this.elementosPagina.push(contenedor);
    }
  }
}
