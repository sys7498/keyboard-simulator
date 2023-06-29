import { EventHandler, EventService, EventType } from "src/app/event-service/event-service"
import { NIndex, NotificationService, NotifyHandler } from "src/app/notification-service/notification-service"
import { SceneGraphService } from "src/app/scene-graph-service/scene-graph-service"
import * as THREE from "three";
import { Particle } from "./particle";
import { DEG2RAD } from "three/src/math/MathUtils";

export class Spring extends THREE.Line{
    public originLength: number;
    public k: number;
    public damping: number;
    constructor(
        private _event: EventService,
        private _notification: NotificationService,
        private _sceneGraph: SceneGraphService,
        public particle0: Particle,
        public particle1: Particle,
    ) {
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setFromPoints([particle0.position, particle1.position])
        super(lineGeometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
        this.originLength = particle0.position.distanceTo(particle1.position);
        this.k = 0.085;
        this.damping = 0.07
        //this._sceneGraph.group.add(this);
        this._eventHandler = new EventHandler(this._event);
        this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
    }

    public reset() {
        this.geometry.attributes['position'].setXYZ(0, this.particle0.position.x, this.particle0.position.y, this.particle0.position.z);
        this.geometry.attributes['position'].setXYZ(1, this.particle1.position.x, this.particle1.position.y, this.particle1.position.z);
        this.geometry.attributes['position'].needsUpdate = true;
    }

    public applyForce() {
        let point0 = this.particle0.position;
        let point1 = this.particle1.position;
        const distance =  point0.clone().sub(point1);
        const direction = point0.clone().sub(point1).normalize();
        const diffVelocity = new THREE.Vector3().subVectors(this.particle0.velocity, this.particle1.velocity);
        const force = direction.multiplyScalar(this.k * (distance.length() - this.originLength) + this.damping * diffVelocity.dot(direction));
        this.particle0.applyForce(force.negate());
        this.particle1.applyForce(force.negate());
        this.particle0.update();
        this.particle1.update();
        this.geometry.attributes['position'].setXYZ(0, this.particle0.position.x, this.particle0.position.y, this.particle0.position.z);
        this.geometry.attributes['position'].setXYZ(1, this.particle1.position.x, this.particle1.position.y, this.particle1.position.z);
        this.geometry.attributes['position'].needsUpdate = true;
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