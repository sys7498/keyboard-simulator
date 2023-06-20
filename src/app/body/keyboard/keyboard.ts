import { EventHandler, EventService, EventType } from "src/app/event-service/event-service"
import { NIndex, NotificationService, NotifyHandler } from "src/app/notification-service/notification-service"
import { SceneGraphService } from "src/app/scene-graph-service/scene-graph-service"
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { DEG2RAD } from "three/src/math/MathUtils";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

export class Keyboard{
    public offset = 0.5;
    constructor(
        private _event: EventService,
        private _notification: NotificationService,
        private _sceneGraph: SceneGraphService
    ) {
        this._eventHandler = new EventHandler(this._event);
        this._eventHandler.set(EventType.OnKeyDown, this.onKeyDown.bind(this));
        this._eventHandler.set(EventType.OnKeyUp, this.onKeyUp.bind(this));
        this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
        this._keyBoard = null;
        this._isKeyCapDown = {};
    }

    private createWindow(): void { 
        const windowElement = document.createElement('div');
        const window = new CSS2DObject(windowElement);
        windowElement.textContent = 'asdfasdfasdfasdfasdf';
        window.position.set(0, -10, 10)
        this._sceneGraph.group.add(window);
    }

    private createKeyboard(): void { 
        new GLTFLoader().setPath('assets/').load('new_keyboard.gltf', (gltf) => {
            this._keyBoard = gltf.scene;
            this._sceneGraph.group.add(gltf.scene);
            this._keyBoard.children.forEach((child, index) => {
                (child as THREE.Mesh).material = new THREE.MeshPhysicalMaterial({ color: 0xDCDCDC });
                const windowElement = document.createElement('div');
                const window = new CSS2DObject(windowElement);
                windowElement.textContent = child.name;
                window.position.set(0, 0, 1)
                child.add(window);
                this._isKeyCapDown[child.name] = false;
            });
        });
    }

    private findKeyCap(name: string): number{
        return this._keyBoard!.children.findIndex((child) => child.name === name);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (!this._isKeyCapDown[event.key]) { 
            this._isKeyCapDown[event.key] = true;
            this._keyBoard!.children[this.findKeyCap(event.key)].translateZ(-this.offset);
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        console.log(event.key)
        this._keyBoard!.children[this.findKeyCap(event.key)].translateZ(this.offset);
        this._isKeyCapDown[event.key] = false;
    }

    private onNotify(nid: number, params: any, sender: any) {
        switch (nid) {
            case NIndex.createdViewportDiv: {
                this.createKeyboard();  
                this.createWindow();
				break;
			}
		}
    }
    
    private _eventHandler: EventHandler;
    private _notifyHandler: NotifyHandler;
    private _keyBoard: THREE.Object3D | null;
    private _isKeyCapDown: any;
}