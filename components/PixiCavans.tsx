"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import Matter from "matter-js";
import { BlurFilter } from "pixi.js";

const COIN_TEXTURE = "/images/pieceOr.png";

const WIDTH = 400;
const HEIGHT = 650; // ✅ PLUS HAUT (avant 500)

const COIN_SIZE = 42;
const MAX_COINS = 190;

export default function PixiCanvasWithPhysics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodiesToSprites = useRef<Map<Matter.Body, PIXI.Sprite>>(new Map());

  useEffect(() => {
    const app = new PIXI.Application({
      width: WIDTH,
      height: HEIGHT,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    const host = containerRef.current;
    if (!host) return;
    host.appendChild(app.view as HTMLCanvasElement);

    /* =====================
       PARAMÈTRES TUBE
       ✅ le haut ne bouge pas, seul le bas descend
    ====================== */
    const RING_W = WIDTH * 0.42;
    const RING_H = 22;

    const RING_COUNT = 4;
    const TOP_RING_Y = 62; // ✅ RESTE FIXE (donc ça ne monte pas)

    // Marge bas (espace pour le socle + un peu d’air)
    const BOTTOM_MARGIN = 90;

    // ✅ Gap calculé pour remplir la hauteur vers le bas, espacement constant
    const available = HEIGHT - BOTTOM_MARGIN - TOP_RING_Y;
    const RING_GAP = available / (RING_COUNT - 1);

    const RING_Y_POSITIONS = Array.from(
      { length: RING_COUNT },
      (_, i) => TOP_RING_Y + i * RING_GAP
    );

    const BASE_RING_Y = RING_Y_POSITIONS[RING_Y_POSITIONS.length - 1];
    const SPAWN_Y = TOP_RING_Y - (RING_H + 6);

    /* =====================
       MATTER
       ✅ sol calé sous le dernier ring
    ====================== */
    const engine = Matter.Engine.create();
    engine.gravity.y = 0.8;
    const world = engine.world;

    const GROUND_Y = BASE_RING_Y + (RING_H + 26);

    const ground = Matter.Bodies.rectangle(
      WIDTH / 2,
      GROUND_Y,
      WIDTH * 1.35,
      60,
      {
        isStatic: true,
      }
    );

    const wallThickness = 12;
    const leftWall = Matter.Bodies.rectangle(
      34,
      HEIGHT / 2,
      wallThickness,
      HEIGHT * 1.5,
      {
        isStatic: true,
        angle: 0.07,
      }
    );
    const rightWall = Matter.Bodies.rectangle(
      WIDTH - 34,
      HEIGHT / 2,
      wallThickness,
      HEIGHT * 1.5,
      {
        isStatic: true,
        angle: -0.07,
      }
    );

    Matter.World.add(world, [ground, leftWall, rightWall]);

    /* =====================
       SCÈNE PIXI
    ====================== */
    const scene = new PIXI.Container();
    app.stage.addChild(scene);

    const coinsLayer = new PIXI.Container();
    scene.addChild(coinsLayer);

    const edgesLayer = new PIXI.Container();
    scene.addChild(edgesLayer);

    const ringsLayer = new PIXI.Container();
    scene.addChild(ringsLayer);

    /* =====================
       EDGES (bords verre) reliés sur toute la hauteur du tube
       ✅ suivent automatiquement le bas
    ====================== */
    const EDGE_W = 30;
    const EDGE_Y_TOP = TOP_RING_Y - 26;
    const EDGE_Y_BOTTOM = BASE_RING_Y + 44;
    const EDGE_H = EDGE_Y_BOTTOM - EDGE_Y_TOP;

    const edgeXLeft = WIDTH / 2 - RING_W - EDGE_W / 2;
    const edgeXRight = WIDTH / 2 + RING_W - EDGE_W / 2;

    const makeGlassEdgeTexture = (w: number, h: number, flip: boolean) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d")!;

      const v = ctx.createLinearGradient(0, 0, 0, h);
      v.addColorStop(0.0, "rgba(255,255,255,0.15)");
      v.addColorStop(0.15, "rgba(255,255,255,0.20)");
      v.addColorStop(0.5, "rgba(255,255,255,0.22)");
      v.addColorStop(0.85, "rgba(255,255,255,0.20)");
      v.addColorStop(1.0, "rgba(255,255,255,0.15)");

      const hGrad = ctx.createLinearGradient(flip ? w : 0, 0, flip ? 0 : w, 0);
      hGrad.addColorStop(0.0, "rgba(0,166,217,0.05)");
      hGrad.addColorStop(0.35, "rgba(0,166,217,0.22)");
      hGrad.addColorStop(0.55, "rgba(255,255,255,0.40)");
      hGrad.addColorStop(0.8, "rgba(0,166,217,0.18)");
      hGrad.addColorStop(1.0, "rgba(0,166,217,0.05)");

      ctx.fillStyle = hGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);

      return PIXI.Texture.from(c);
    };

    const leftEdge = new PIXI.Sprite(
      makeGlassEdgeTexture(EDGE_W, EDGE_H, false)
    );
    leftEdge.x = edgeXLeft;
    leftEdge.y = EDGE_Y_TOP;
    leftEdge.alpha = 0.85;
    leftEdge.blendMode = PIXI.BLEND_MODES.ADD;
    leftEdge.filters = [new BlurFilter(2)];
    edgesLayer.addChild(leftEdge);

    const rightEdge = new PIXI.Sprite(
      makeGlassEdgeTexture(EDGE_W, EDGE_H, true)
    );
    rightEdge.x = edgeXRight;
    rightEdge.y = EDGE_Y_TOP;
    rightEdge.alpha = 0.85;
    rightEdge.blendMode = PIXI.BLEND_MODES.ADD;
    rightEdge.filters = [new BlurFilter(2)];
    edgesLayer.addChild(rightEdge);

    const edgeGlow = new PIXI.Graphics();
    edgeGlow.beginFill(0x00a6d9, 0.05);
    edgeGlow.drawRoundedRect(
      edgeXLeft - 14,
      EDGE_Y_TOP + 10,
      edgeXRight + EDGE_W + 14 - (edgeXLeft - 14),
      EDGE_H - 20,
      80
    );
    edgeGlow.endFill();
    edgeGlow.filters = [new BlurFilter(28)];
    edgesLayer.addChild(edgeGlow);

    /* =====================
       RINGS (même visibilité partout)
    ====================== */
    const drawRing = (y: number) => {
      // Glow plus discret
      const glow = new PIXI.Graphics();
      glow.beginFill(0x00a6d9, 0.16); // ⬇️ avant 0.26
      glow.drawEllipse(WIDTH / 2, y, RING_W + 12, RING_H + 10);
      glow.endFill();
      glow.filters = [new BlurFilter(14)]; // ⬇️ blur un peu réduit
      glow.blendMode = PIXI.BLEND_MODES.ADD;
      ringsLayer.addChild(glow);

      // Cercle principal plus doux
      const ring = new PIXI.Graphics();
      ring.lineStyle(3, 0x00cfe6, 0.65); // ⬇️ avant 0.95
      ring.drawEllipse(WIDTH / 2, y, RING_W, RING_H);
      ring.blendMode = PIXI.BLEND_MODES.ADD;
      ringsLayer.addChild(ring);
    };

    RING_Y_POSITIONS.forEach(drawRing);

    /* =====================
       COINS
    ====================== */
    const texture = PIXI.Texture.from(COIN_TEXTURE);

    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (bodiesToSprites.current.size >= MAX_COINS) return;

      const sprite = new PIXI.Sprite(texture);
      const scale = 0.55 + Math.random() * 0.25;

      sprite.width = COIN_SIZE * scale;
      sprite.height = COIN_SIZE * scale;
      sprite.anchor.set(0.5);

      sprite.x = WIDTH / 2 + (Math.random() - 0.5) * 70;
      sprite.y = SPAWN_Y;

      sprite.rotation = (Math.random() - 0.5) * 0.6;
      sprite.alpha = 0.95;

      coinsLayer.addChild(sprite);

      const body = Matter.Bodies.rectangle(
        sprite.x,
        sprite.y,
        sprite.width,
        sprite.height
      );
      Matter.World.add(world, body);
      bodiesToSprites.current.set(body, sprite);
    };

    window.addEventListener("keydown", onKey);

    app.ticker.add(() => {
      Matter.Engine.update(engine);
      bodiesToSprites.current.forEach((sprite, body) => {
        sprite.x = body.position.x;
        sprite.y = body.position.y;
        sprite.rotation = body.angle;
      });
    });

    return () => {
      window.removeEventListener("keydown", onKey);
      app.destroy(true, { children: true });
      bodiesToSprites.current.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden"
      style={{ width: WIDTH, height: HEIGHT }}
    />
  );
}
