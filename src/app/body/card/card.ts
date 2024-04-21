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
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

export class Card {
  public offset = 0.5;
  public paragraph: any;
  public card: THREE.Object3D | null;
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
    this.card = null;
  }

  public update(dt: number) {}

  private createCard(): void {
    const div = document.createElement('div');
    div.className = 'label';
    div.style.height = '100px';
    div.style.width = '50px';
    div.innerHTML = 'Hello there!';
    div.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    this.card = new CSS3DObject(div);
    this.card.rotateZ(Math.PI / 2);
    this.card.rotateX(-Math.PI / 2);
    this.card.position.set(0, 0, 0);
    this.card.rotateZ(Math.PI / 2);
    //this._sceneGraph.scene.add(this.card);
  }
  private onKeyDown(event: KeyboardEvent): void {}

  private onKeyUp(event: KeyboardEvent): void {}

  private randomAnimate(): void {
    console.log();
  }

  private onInput(event: InputEvent): void {}

  private onNotify(nid: number, params: any, sender: any) {
    switch (nid) {
      case NIndex.createdViewportDiv: {
        //this.createCard();
        console.log('Asd');
        break;
      }
    }
  }

  private _eventHandler: EventHandler;
  private _notifyHandler: NotifyHandler;
}
