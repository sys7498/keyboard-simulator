import {
  EventHandler,
  EventService,
  EventType,
} from 'src/app/event-service/event-service';
import {
  NIndex,
  NotificationService,
  NotifyHandler,
} from 'src/app/notification-service/notification-service';
import { SceneGraphService } from 'src/app/scene-graph-service/scene-graph-service';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { DEG2RAD } from 'three/src/math/MathUtils';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
//import { Text } from "troika-three-text";
import * as TWEEN from '@tweenjs/tween.js';

export class Keyboard {
  public offset = 0.5;
  public paragraph: any;
  public keyBoard: THREE.Object3D | null;
  constructor(
    private _event: EventService,
    private _notification: NotificationService,
    private _sceneGraph: SceneGraphService
  ) {
    this._eventHandler = new EventHandler(this._event);
    this._eventHandler.set(EventType.OnKeyDown, this.onKeyDown.bind(this));
    this._eventHandler.set(EventType.OnKeyUp, this.onKeyUp.bind(this));
    this._eventHandler.set(EventType.OnInput, this.onInput.bind(this));
    this._notifyHandler = new NotifyHandler(
      this._notification,
      this.onNotify.bind(this)
    );
    this.keyBoard = null;
    this._isKeyCapDown = {};
    this._clock = new THREE.Clock();
    //this.paragraph = new Text();
    this._tweens = {};
  }

  private createWindow(): void {
    this.paragraph.font = 'assets/NotoSansKR-Regular.otf';
    this.paragraph.text = '';
    this.paragraph.fontSize = 1;
    this.paragraph.color = 0x000000;
    this.paragraph.anchorX = 'center';
    this.paragraph.anchorY = 'middle';
    this.paragraph.overflowWrap = 'break-word';
    this.paragraph.maxWidth = 32;
    //this.paragraph.position.set(0, -7, 10);
    this.paragraph.position.set(-10, -27, 10);
    this.paragraph.rotation.set(DEG2RAD * 90, DEG2RAD * 180, 0);
    this.paragraph.sync();
    this._sceneGraph.group.add(this.paragraph);
  }

  public update(dt: number) {}

  private createKeyboard(): void {
    new GLTFLoader().setPath('assets/').load('new_keyboard.gltf', (gltf) => {
      this.keyBoard = gltf.scene;
      this.keyBoard.position.set(0, 0, 0);
      this._sceneGraph.group.add(gltf.scene);
      this.keyBoard.children.forEach((child, index) => {
        if (child.name === 'board') {
          (child as THREE.Mesh).material = new THREE.MeshPhysicalMaterial({
            color: 0x1d1e23,
          });
        } else {
          (child as THREE.Mesh).material = new THREE.MeshPhysicalMaterial({
            color: 0xdcdcdc,
          });
        }
        this._isKeyCapDown[child.name] = false;
        let tweenDown = new TWEEN.Tween(child.position).to(
          { z: child.position.z - 0.5 },
          100
        );
        let tweenUp = new TWEEN.Tween(child.position).to(
          { z: child.position.z },
          100
        );
        this._tweens[child.name] = [tweenDown, tweenUp];
      });
    });
  }

  private findKeyCap(name: string): number {
    return this.keyBoard!.children.findIndex((child) => child.name === name);
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this._isKeyCapDown[event.code]) {
      if (
        this._tweens[
          this.keyBoard!.children[this.findKeyCap(event.code)].name
        ][1].isPlaying()
      ) {
        this._tweens[
          this.keyBoard!.children[this.findKeyCap(event.code)].name
        ][1].stop();
      }
      this._isKeyCapDown[event.code] = true;
      this._tweens[
        this.keyBoard!.children[this.findKeyCap(event.code)].name
      ][0].start();
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (
      this._tweens[
        this.keyBoard!.children[this.findKeyCap(event.code)].name
      ][0].isPlaying()
    ) {
      this._tweens[
        this.keyBoard!.children[this.findKeyCap(event.code)].name
      ][0].stop();
    }
    this._isKeyCapDown[event.code] = false;
    this._tweens[
      this.keyBoard!.children[this.findKeyCap(event.code)].name
    ][1].start();
  }

  private randomAnimate(): void {}

  private onInput(event: InputEvent): void {
    this.paragraph.sync();
  }

  private onNotify(nid: number, params: any, sender: any) {
    switch (nid) {
      case NIndex.createdViewportDiv: {
        this.createKeyboard();
        console.log('createdViewportDiv');
        //this.createWindow();
        break;
      }
    }
  }

  private _eventHandler: EventHandler;
  private _notifyHandler: NotifyHandler;
  private _isKeyCapDown: any;
  private _clock: THREE.Clock;
  private _tweens: any;
}
