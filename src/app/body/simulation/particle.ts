import { EventHandler, EventService, EventType } from "src/app/event-service/event-service"
import { NIndex, NotificationService, NotifyHandler } from "src/app/notification-service/notification-service"
import { SceneGraphService } from "src/app/scene-graph-service/scene-graph-service"
import * as THREE from "three";

export class Particle extends THREE.Mesh{
    
    public force: THREE.Vector3;
    public velocity: THREE.Vector3;
    public mass: number;
    public lifeSpan: number;
    public originPosition: THREE.Vector3;
    constructor(
        private _event: EventService,
        private _notification: NotificationService,
        private _sceneGraph: SceneGraphService
    ) {
        super(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));
        this.force = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.velocity.normalize();
        this.mass = 1;
        this.lifeSpan = 255;
        this.originPosition = this.position.clone();
        this._sceneGraph.group.add(this);
        this._eventHandler = new EventHandler(this._event);
        this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
    }

    public groundCheck() {
        if (this.position.z < 0.5) {
            this.position.setZ(0);
            this.velocity.set(0, 0, 0)
       }
    }
    public reset() {
        this.force = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.position.copy(this.originPosition);
    }
    
    public update() {
        this.velocity.add(this.force.divideScalar(this.mass).clone());
        this.position.add(this.velocity);
        this.groundCheck();
        this.force.set(0, 0, 0);
    }

    public applyForce(force: THREE.Vector3) {
        this.force.add(force);
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