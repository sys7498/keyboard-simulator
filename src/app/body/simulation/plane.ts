import { EventHandler, EventService, EventType } from "src/app/event-service/event-service"
import { NIndex, NotificationService, NotifyHandler } from "src/app/notification-service/notification-service"
import { SceneGraphService } from "src/app/scene-graph-service/scene-graph-service"
import * as THREE from "three";
import { Particle } from "./particle";

export class Plane extends THREE.Mesh { 
    constructor(
        private _event: EventService,
        private _notification: NotificationService,
        private _sceneGraph: SceneGraphService,
        public particles: Particle[],
    ) {
        let geometry = new THREE.BufferGeometry();
        geometry.setFromPoints(particles.map(p => p.position))
        geometry.computeVertexNormals();
        super(geometry, new THREE.MeshPhysicalMaterial({ color: 0x5d8aa8, side: THREE.DoubleSide }));
        this._originVertex = particles.map(p => p.position.clone());
        this._sceneGraph.group.add(this);
        this._eventHandler = new EventHandler(this._event);
        this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
    }

    public update() {
        for (let i = 0; i < this.particles.length; i++) {
            this.geometry.attributes['position'].setXYZ(i, this.particles[i].position.x, this.particles[i].position.y, this.particles[i].position.z);
        }
        this.geometry.computeVertexNormals();
        this.geometry.attributes['position'].needsUpdate = true;
        this.geometry.attributes['normal'].needsUpdate = true;

    }

    public reset() {
        for (let i = 0; i < this._originVertex.length; i++) {
            this.geometry.attributes['position'].setXYZ(i, this._originVertex[i].x, this._originVertex[i].y, this._originVertex[i].z);
        }
        this.geometry.computeVertexNormals();
        this.geometry.attributes['position'].needsUpdate = true;
        this.geometry.attributes['normal'].needsUpdate = true;
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
    private _originVertex: THREE.Vector3[];
}