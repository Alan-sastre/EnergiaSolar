import PuzzleSolarScene from "./scenas/PuzzleSolarScene.js";
import Puzzle2Scene from "./scenas/Puzzle2Scene.js";
import Puzzle3Scene from "./scenas/Puzzle3Scene.js";
import Puzzle4Scene from "./scenas/Puzzle4Scene.js";

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 500,
  parent: "game-container",
  backgroundColor: "#001532",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [PuzzleSolarScene, Puzzle2Scene, Puzzle3Scene, Puzzle4Scene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000,
    height: 500,
  },
};

const game = new Phaser.Game(config);

const applyMobileSafeZoom = () => {
  const isSmallMobile = window.innerWidth < 900 || window.innerHeight < 520;
  const nextZoom = isSmallMobile ? 0.92 : 1;
  game.scale.setZoom(nextZoom);
  game.scale.refresh();
};

window.addEventListener("resize", applyMobileSafeZoom);
window.addEventListener("orientationchange", applyMobileSafeZoom);
window.addEventListener("DOMContentLoaded", applyMobileSafeZoom);
