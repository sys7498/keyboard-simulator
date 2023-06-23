import { EventHandler, EventService, EventType } from "src/app/event-service/event-service"
import { NIndex, NotificationService, NotifyHandler } from "src/app/notification-service/notification-service"
import { SceneGraphService } from "src/app/scene-graph-service/scene-graph-service"
import * as THREE from "three";
import { Particle } from "./particle";

export class Simulation{
    public gravityAccel: THREE.Vector3;
    constructor(
        private _event: EventService,
        private _notification: NotificationService,
        private _sceneGraph: SceneGraphService
    ) {
        this.gravityAccel = new THREE.Vector3(0, 0, -9.8);
        this._eventHandler = new EventHandler(this._event);
        this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
        this._particles = [];
        this._particles.push(new Particle(this._event, this._notification));
        this._sceneGraph.group.add(this._particles[0]);
        this._particles[0].position.set(20, 0, 20);
    }

    public startSimulation(dt: number): void {
        let newVel = this._particles[0].velocity.add(this.gravityAccel.multiplyScalar(dt));
        let newPos = this._particles[0].position.add(this._particles[0].velocity.multiplyScalar(dt))
        this._particles[0].velocity.copy(newVel);
        this._particles[0].position.copy(newPos);
        console.log(dt);
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
    private _particles: Particle[];
}