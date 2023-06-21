import { EventHandler, EventService, EventType } from "src/app/event-service/event-service"
import { NIndex, NotificationService, NotifyHandler } from "src/app/notification-service/notification-service"
import { SceneGraphService } from "src/app/scene-graph-service/scene-graph-service"
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { DEG2RAD } from "three/src/math/MathUtils";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { Text } from "troika-three-text";

export class Keyboard{
    public offset = 0.5;
    public paragraph: any;
    public a = 0;
    constructor(
        private _event: EventService,
        private _notification: NotificationService,
        private _sceneGraph: SceneGraphService
    ) {
        this._eventHandler = new EventHandler(this._event);
        this._eventHandler.set(EventType.OnKeyDown, this.onKeyDown.bind(this));
        this._eventHandler.set(EventType.OnKeyUp, this.onKeyUp.bind(this));
        this._eventHandler.set(EventType.OnInput, this.onInput.bind(this));
        this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
        this._keyBoard = null;
        this._isKeyCapDown = {};
        this.paragraph = new Text();
    }

    private createWindow(): void {
        this.paragraph.font = 'assets/NotoSansKR-Regular.otf'
        this.paragraph.text = '안녕';
        this.paragraph.fontSize = 0.5;
        this.paragraph.color = 0x000000;
        this.paragraph.position.set(17, -10, 10);
        this.paragraph.rotation.set(DEG2RAD * 90, DEG2RAD * 180 , 0)
        this.paragraph.sync();
        this._sceneGraph.group.add(this.paragraph);
    }

    private createKeyboard(): void { 
        new GLTFLoader().setPath('assets/').load('new_keyboard.gltf', (gltf) => {
            this._keyBoard = gltf.scene;
            this._sceneGraph.group.add(gltf.scene);
            this._keyBoard.children.forEach((child, index) => {
                if (child.name === 'board') {
                    (child as THREE.Mesh).material = new THREE.MeshPhysicalMaterial({ color: 0x1D1E23 });
                } else {
                    (child as THREE.Mesh).material = new THREE.MeshPhysicalMaterial({ color: 0xDCDCDC });
                }
                //const alphabet = new Text();
                //alphabet.text = child.name;
                //alphabet.fontSize = 0.5;
                //alphabet.color = 0x000000;
                //alphabet.position.set(0, 0, 2.01);
                //alphabet.rotation.set(0, 0, DEG2RAD * -90);
                //child.add(alphabet);
                //alphabet.sync();
                this._isKeyCapDown[child.name] = false;
            });
        });
    }

    private findKeyCap(name: string): number{
        return this._keyBoard!.children.findIndex((child) => child.name === name);
    }

    private onKeyDown(event: KeyboardEvent): void {
        console.log(event.code)
        if (!this._isKeyCapDown[event.code]) { 
            this._isKeyCapDown[event.code] = true;
            this._keyBoard!.children[this.findKeyCap(event.code)].translateZ(-this.offset);
        }
        
    }

    private onKeyUp(event: KeyboardEvent): void {
        console.log(event.code)
        console.log(this.a++)
        this._keyBoard!.children[this.findKeyCap(event.code)].translateZ(this.offset);
        this._isKeyCapDown[event.code] = false;
    }

    private onInput(event: InputEvent): void{
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