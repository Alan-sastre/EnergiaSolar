export default class Puzzle4Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Puzzle4Scene" });
  }

  create() {
    this.isPanelPlaced = false;
    this.isBatteryPlaced = false;
    this.isBulbPlaced = false;
    this.isDragging = false;

    this.createBackground();
    this.createHouse();
    this.createDropZones();
    this.createDraggables();
    this.createTutorialHand();
    this.createAmbientAnimations();
    this.registerInputEvents();
  }

  createBackground() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x64b5f6, 0x64b5f6, 0xe1f5fe, 0xe1f5fe, 1);
    bg.fillRect(0, 0, 1000, 500);
    bg.fillStyle(0xffffff, 0.12);
    bg.fillEllipse(250, 190, 460, 120);
    bg.fillEllipse(740, 160, 440, 110);

    const mountain = new Phaser.Curves.Path(0, 390);
    bg.fillStyle(0x90a4ae, 0.85);
    mountain.lineTo(180, 280);
    mountain.lineTo(350, 390);
    mountain.lineTo(560, 290);
    mountain.lineTo(760, 390);
    mountain.lineTo(1000, 300);
    mountain.lineTo(1000, 500);
    mountain.lineTo(0, 500);
    mountain.closePath();
    bg.fillPoints(mountain.getPoints());

    this.drawSun(900, 100, 55);

    bg.fillStyle(0x66bb6a, 1);
    bg.fillRect(0, 420, 1000, 80);

    for (let i = 0; i < 6; i++) {
      const x = 70 + i * 170;
      const tree = this.add.graphics();
      tree.fillStyle(0x6d4c41, 1);
      tree.fillRect(x, 390, 16, 40);
      tree.fillStyle(0x43a047, 1);
      tree.fillCircle(x + 8, 380, 28);
      tree.fillCircle(x - 12, 390, 18);
      tree.fillCircle(x + 24, 390, 18);
    }
  }

  drawSun(x, y, radius) {
    const sun = this.add.container(x, y);
    const core = this.add.graphics();
    core.fillStyle(0xffeb3b, 1);
    core.fillCircle(0, 0, radius);
    sun.add(core);

    for (let i = 0; i < 12; i++) {
      const ray = this.add.graphics();
      ray.fillStyle(0xffc107, 0.8);
      ray.fillTriangle(radius - 2, -8, radius + 28, 0, radius - 2, 8);
      ray.setAngle(i * 30);
      sun.add(ray);
    }

    this.tweens.add({
      targets: sun,
      angle: 360,
      duration: 22000,
      repeat: -1,
      ease: "Linear",
    });
  }

  createHouse() {
    const house = this.add.graphics();
    house.fillStyle(0xffcc80, 1);
    house.fillRect(560, 190, 320, 220);

    house.fillStyle(0x8d6e63, 1);
    house.fillTriangle(530, 200, 720, 90, 910, 200);

    house.fillStyle(0x6d4c41, 1);
    house.fillRect(690, 315, 65, 95);

    this.windowLeft = this.add
      .rectangle(620, 280, 60, 55, 0x90caf9)
      .setStrokeStyle(3, 0xffffff, 0.7);
    this.windowRight = this.add
      .rectangle(815, 280, 60, 55, 0x90caf9)
      .setStrokeStyle(3, 0xffffff, 0.7);
    this.houseLamp = this.add.circle(725, 170, 18, 0xb0bec5);
    this.houseLampGlow = this.add.circle(725, 170, 70, 0xffeb3b, 0);

    this.add.text(130, 50, "Puzzle 4: Energiza la Casa Solar", {
      fontFamily: "Arial",
      fontSize: "38px",
      color: "#0d47a1",
      fontStyle: "bold",
    });
  }

  createDropZones() {
    this.dropZonePanel = this.add
      .zone(650, 170, 130, 80)
      .setRectangleDropZone(130, 80);
    this.dropZoneBattery = this.add
      .zone(615, 375, 90, 90)
      .setRectangleDropZone(90, 90);
    this.dropZoneBulb = this.add.zone(725, 170, 45, 45).setCircleDropZone(22);

    this.add
      .rectangle(650, 170, 120, 70, 0x000000, 0.12)
      .setStrokeStyle(2, 0xffffff, 0.4);
    this.add
      .rectangle(615, 375, 80, 80, 0x000000, 0.12)
      .setStrokeStyle(2, 0xffffff, 0.4);
    this.add
      .circle(725, 170, 20, 0x000000, 0.12)
      .setStrokeStyle(2, 0xffffff, 0.4);
  }

  createDraggables() {
    this.panelItem = this.createPanelItem(140, 455);
    this.batteryItem = this.createBatteryItem(280, 455);
    this.bulbItem = this.createBulbItem(410, 455);
  }

  createPanelItem(x, y) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(0x1565c0, 1);
    g.fillRoundedRect(-52, -34, 104, 68, 6);
    g.fillStyle(0x1e88e5, 1);
    g.fillRoundedRect(-46, -28, 92, 56, 4);
    g.lineStyle(2, 0x90caf9, 0.7);
    g.lineBetween(-15, -28, -15, 28);
    g.lineBetween(15, -28, 15, 28);
    g.lineBetween(-46, 0, 46, 0);
    container.add(g);

    container.setSize(104, 68);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-52, -34, 104, 68),
      Phaser.Geom.Rectangle.Contains,
    );
    this.input.setDraggable(container);
    container.setData("type", "panel");
    return container;
  }

  createBatteryItem(x, y) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(0x37474f, 1);
    g.fillRoundedRect(-30, -42, 60, 84, 8);
    g.fillStyle(0x00e676, 1);
    g.fillRect(-20, -20, 40, 16);
    g.fillStyle(0xffffff, 1);
    g.fillRect(-8, -36, 16, 6);
    g.lineStyle(2, 0xffffff, 0.7);
    g.lineBetween(-12, 15, 12, 15);
    container.add(g);

    container.setSize(60, 84);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-30, -42, 60, 84),
      Phaser.Geom.Rectangle.Contains,
    );
    this.input.setDraggable(container);
    container.setData("type", "battery");
    return container;
  }

  createBulbItem(x, y) {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(0xfff176, 1);
    g.fillCircle(0, -10, 22);
    g.fillStyle(0x90a4ae, 1);
    g.fillRoundedRect(-10, 10, 20, 24, 4);
    g.lineStyle(2, 0x607d8b, 1);
    g.lineBetween(-8, 16, 8, 16);
    g.lineBetween(-8, 22, 8, 22);
    g.lineBetween(-8, 28, 8, 28);
    container.add(g);

    container.setSize(44, 68);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-22, -32, 44, 68),
      Phaser.Geom.Rectangle.Contains,
    );
    this.input.setDraggable(container);
    container.setData("type", "bulb");
    return container;
  }

  registerInputEvents() {
    this.input.on("dragstart", () => {
      this.isDragging = true;
      this.hideTutorialHand();
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = Phaser.Math.Clamp(dragX, 50, 950);
      gameObject.y = Phaser.Math.Clamp(dragY, 50, 470);
    });

    this.input.on("dragend", () => {
      this.isDragging = false;
      this.showHint();
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      const type = gameObject.getData("type");

      if (type === "panel" && dropZone === this.dropZonePanel) {
        gameObject.setPosition(dropZone.x, dropZone.y);
        gameObject.input.enabled = false;
        this.isPanelPlaced = true;
        this.createBurst(dropZone.x, dropZone.y);
      } else if (type === "battery" && dropZone === this.dropZoneBattery) {
        gameObject.setPosition(dropZone.x, dropZone.y);
        gameObject.input.enabled = false;
        this.isBatteryPlaced = true;
        this.createBurst(dropZone.x, dropZone.y);
      } else if (type === "bulb" && dropZone === this.dropZoneBulb) {
        gameObject.setPosition(dropZone.x, dropZone.y);
        gameObject.input.enabled = false;
        this.isBulbPlaced = true;
        this.createBurst(dropZone.x, dropZone.y);
      } else {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }

      this.checkWin();
    });
  }

  createTutorialHand() {
    this.hand = this.add.container(0, 0);
    const handText = this.add
      .text(0, 0, "👆🏻", { fontSize: "50px" })
      .setOrigin(0.5);
    this.hand.add(handText);
    this.hand.setDepth(200);
    this.hand.setVisible(false);
    this.showHint();
  }

  hideTutorialHand() {
    this.hand.setVisible(false);
    this.tweens.killTweensOf(this.hand);
  }

  showHint() {
    this.tweens.killTweensOf(this.hand);
    if (this.isDragging) return;

    let target = null;
    let dest = null;

    if (!this.isPanelPlaced) {
      target = this.panelItem;
      dest = { x: this.dropZonePanel.x, y: this.dropZonePanel.y };
    } else if (!this.isBatteryPlaced) {
      target = this.batteryItem;
      dest = { x: this.dropZoneBattery.x, y: this.dropZoneBattery.y };
    } else if (!this.isBulbPlaced) {
      target = this.bulbItem;
      dest = { x: this.dropZoneBulb.x, y: this.dropZoneBulb.y };
    }

    if (!target || !dest) {
      this.hand.setVisible(false);
      return;
    }

    this.hand.setVisible(true);
    this.hand.setAlpha(1);
    this.hand.setScale(1);
    this.hand.setPosition(target.x, target.y);

    this.tweens.timeline({
      tweens: [
        {
          targets: this.hand,
          scale: { from: 1.4, to: 1 },
          duration: 300,
          ease: "Back.out",
        },
        {
          targets: this.hand,
          x: dest.x,
          y: dest.y,
          duration: 1200,
          ease: "Power2",
        },
        {
          targets: this.hand,
          alpha: 0,
          duration: 250,
          onComplete: () => {
            this.hand.setVisible(false);
            this.hand.setAlpha(1);
            if (!this.isDragging) {
              this.time.delayedCall(250, () => this.showHint());
            }
          },
        },
      ],
    });
  }

  createAmbientAnimations() {
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.ellipse(
        150 + i * 170,
        110 + (i % 2) * 30,
        90,
        50,
        0xffffff,
        0.7,
      );
      this.tweens.add({
        targets: cloud,
        x: cloud.x + 80,
        duration: 4000 + i * 1200,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  checkWin() {
    if (this.isPanelPlaced && this.isBatteryPlaced && this.isBulbPlaced) {
      this.hideTutorialHand();
      this.activateHouse();
    }
  }

  activateHouse() {
    const wires = this.add.graphics();
    wires.lineStyle(4, 0xffeb3b, 1);
    wires.beginPath();
    wires.moveTo(this.dropZonePanel.x, this.dropZonePanel.y + 40);
    wires.lineTo(this.dropZoneBattery.x, this.dropZoneBattery.y);
    wires.lineTo(this.dropZoneBulb.x, this.dropZoneBulb.y);
    wires.strokePath();

    this.windowLeft.setFillStyle(0xfff59d);
    this.windowRight.setFillStyle(0xfff59d);
    this.houseLamp.setFillStyle(0xffeb3b);

    this.tweens.add({
      targets: this.houseLampGlow,
      alpha: 0.35,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.showWinAnimation();
  }

  showWinAnimation() {
    const overlay = this.add
      .rectangle(0, 0, 1000, 500, 0x000000, 0.6)
      .setOrigin(0, 0)
      .setDepth(250);
    const title = this.add
      .text(500, 190, "¡CASA ENERGIZADA!", {
        fontFamily: "Arial",
        fontSize: "56px",
        color: "#ffeb3b",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(260)
      .setScale(0);

    const subtitle = this.add
      .text(500, 255, "Completaste todos los puzzles solares", {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(260)
      .setAlpha(0);

    const restartBtn = this.add.container(500, 335).setDepth(260).setAlpha(0);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x4caf50, 1);
    btnBg.fillRoundedRect(-150, -36, 300, 72, 14);
    btnBg.lineStyle(3, 0xffffff, 1);
    btnBg.strokeRoundedRect(-150, -36, 300, 72, 14);
    const btnText = this.add
      .text(0, 0, "Volver a jugar", {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    restartBtn.add([btnBg, btnText]);
    restartBtn.setInteractive(
      new Phaser.Geom.Rectangle(-150, -36, 300, 72),
      Phaser.Geom.Rectangle.Contains,
    );
    restartBtn.on("pointerdown", () => {
      this.cameras.main.fade(1500, 0, 0, 0, false, (camera, progress) => {
        if (progress === 1) {
          this.scene.start("PuzzleSolarScene");
        }
      });
    });

    this.tweens.add({
      targets: title,
      scale: 1,
      duration: 900,
      ease: "Back.out",
    });
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 700,
      delay: 450,
    });
    this.tweens.add({
      targets: restartBtn,
      alpha: 1,
      y: 320,
      duration: 850,
      ease: "Power2",
      delay: 800,
    });

    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(300 + i * 180, () => {
        this.createBurst(
          Phaser.Math.Between(180, 820),
          Phaser.Math.Between(120, 420),
        );
      });
    }
  }

  createBurst(x, y) {
    for (let i = 0; i < 14; i++) {
      const p = this.add.circle(
        x,
        y,
        Phaser.Math.Between(2, 5),
        Phaser.Utils.Array.GetRandom([0xffeb3b, 0x4caf50, 0x29b6f6, 0xff7043]),
      );
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = Phaser.Math.FloatBetween(30, 90);
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 700,
        ease: "Quad.out",
        onComplete: () => p.destroy(),
      });
    }
  }
}
