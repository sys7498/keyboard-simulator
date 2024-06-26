import { Injectable } from '@angular/core';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

import {
  NIndex,
  NotificationService,
  NotifyHandler,
} from '../notification-service/notification-service';
import { Renderer } from './renderer/renderer';
import { CameraSet } from './camera/camera-set';
import { EventService, EventHandler } from '../event-service/event-service';
import { Light } from './light/light';
import { Grid } from './misc/grid/grid';
import { Axes } from './misc/axes/axes';
import { DEG2RAD } from 'three/src/math/MathUtils';
import { Keyboard } from '../body/keyboard/keyboard';
import { Simulation } from '../body/simulation/simulation';
import * as TWEEN from '@tweenjs/tween.js';
import { Card } from '../body/card/card';

@Injectable({ providedIn: 'root' })
export class SceneGraphService {
  public readonly scene: THREE.Scene;
  public readonly group: THREE.Group;
  public readonly misc: THREE.Group;
  public readonly cameraSet: CameraSet;
  public readonly renderer: Renderer;
  public readonly light: Light;
  public readonly grid: Grid;
  public readonly axes: Axes;
  public readonly keyboard: Keyboard;
  public readonly simulation: Simulation;

  public readonly card: Card;

  constructor(
    private _event: EventService,
    private _notification: NotificationService
  ) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x696969);
    this.group = new THREE.Group();
    this.misc = new THREE.Group();
    this.cameraSet = new CameraSet(this._event, this._notification);
    this.renderer = new Renderer(
      this._event,
      this._notification,
      this,
      this.cameraSet
    );
    this.light = new Light(this._notification, this);
    this.grid = new Grid(this);
    this.axes = new Axes(this);
    this.keyboard = new Keyboard(this._event, this._notification, this);
    this.card = new Card(this._event, this._notification, this);
    this.simulation = new Simulation(this._event, this._notification, this);
    this.scene.add(this.group);
    this.scene.add(this.misc);
    this._notifyHandler = new NotifyHandler(
      this._notification,
      this.onNotify.bind(this)
    );
  }

  /** 알림 수신 콜백 메서드 */
  private onNotify(nid: number, params: any, sender: any): void {
    switch (nid) {
      case NIndex.createdViewportDiv:
        {
          this.onCreatedViewportDiv(params as HTMLDivElement);
        }
        break;
    }
  }

  /** 뷰포트 div 요소 생성됨 콜백 메서드 */
  private onCreatedViewportDiv(viewportDiv: HTMLDivElement): void {
    this.cameraSet.initialize(viewportDiv, this.renderer.css3DRenderer);
    this.renderer.initialize(viewportDiv);
    this.cameraSet.orbitControls.update();
    startAnimation(this);
  }
  private _notifyHandler: NotifyHandler;
}
/** 애니메이션 함수 */
const startAnimation = function (sceneGraph: SceneGraphService) {
  const clock = new THREE.Clock();
  const animationFrame = function () {
    sceneGraph.renderer.onRender();
    sceneGraph.simulation.update(clock.getDelta());

    TWEEN.update();
    requestAnimationFrame(animationFrame);
  };

  animationFrame();
};
