import { EventHandler, EventService, EventType } from "src/app/event-service/event-service"
import { NIndex, NotificationService, NotifyHandler } from "src/app/notification-service/notification-service"
import { SceneGraphService } from "src/app/scene-graph-service/scene-graph-service"
import * as THREE from "three";

export class Particle extends THREE.Mesh{
    
    public velocity: THREE.Vector3;
    public accumulator: THREE.Vector3;
    public mass: number;
    constructor(
        private _event: EventService,
        private _notification: NotificationService
    ) {
        super(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        this.velocity = new THREE.Vector3(0);
        this.accumulator = new THREE.Vector3(0);
        this.mass = 1;
        this._eventHandler = new EventHandler(this._event);
        this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
    }

    private onNotify(nid: number, params: any, sender: any) {
        switch (nid) {
            case NIndex.createdViewportDiv: {
				break;
			}
		}
    }

    private _eventHandler: EventHandler;
    private _notifyHandler: NotifyHandler;
}