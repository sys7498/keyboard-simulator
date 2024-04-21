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
import { Particle } from './particle';
import { range } from 'rxjs';
import { Spring } from './spring';
import { degToRad } from 'three/src/math/MathUtils';
import { Plane } from './plane';

export class Simulation {
  public gravity: THREE.Vector3;
  public wind: THREE.Vector3;
  constructor(
    private _event: EventService,
    private _notification: NotificationService,
    private _sceneGraph: SceneGraphService
  ) {
    this.gravity = new THREE.Vector3(0, 0, -0.00098);
    this.wind = new THREE.Vector3(0, 0.0005, 0);
    this._eventHandler = new EventHandler(this._event);
    this._eventHandler.set(EventType.OnKeyUp, this.onKeyUp.bind(this));
    this._notifyHandler = new NotifyHandler(
      this._notification,
      this.onNotify.bind(this)
    );
    this._particles = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const particle = new Particle(
          this._event,
          this._notification,
          this._sceneGraph,
          0.05
        );
        particle.position.set(j - 5, -10, i + 10);
        particle.originPosition = particle.position.clone();
        this._particles.push(particle);
      }
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const particle = new Particle(
          this._event,
          this._notification,
          this._sceneGraph,
          0.05
        );
        particle.position.set(j - 4.5, -10, i + 10.5);
        particle.originPosition = particle.position.clone();
        this._particles.push(particle);
      }
    }
    //this._particles[99].position.set(10, 3, 20);
    this._particles[99].originPosition = this._particles[99].position.clone();
    this._springs = [];
    for (let i = 0; i < 99; i++) {
      if (i % 10 == 9) continue;
      const spring = new Spring(
        this._event,
        this._notification,
        this._sceneGraph,
        this._particles[i],
        this._particles[i + 1]
      );
      this._springs.push(spring);
    }
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        const spring = new Spring(
          this._event,
          this._notification,
          this._sceneGraph,
          this._particles[j * 10 + i],
          this._particles[j * 10 + 10 + i]
        );
        this._springs.push(spring);
      }
    }
    for (let i = 0; i < 81; i++) {
      const spring0 = new Spring(
        this._event,
        this._notification,
        this._sceneGraph,
        this._particles[i + 100],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9)]
      );
      const spring1 = new Spring(
        this._event,
        this._notification,
        this._sceneGraph,
        this._particles[i + 100],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9) + 1]
      );
      const spring2 = new Spring(
        this._event,
        this._notification,
        this._sceneGraph,
        this._particles[i + 100],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9) + 10]
      );
      const spring3 = new Spring(
        this._event,
        this._notification,
        this._sceneGraph,
        this._particles[i + 100],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9) + 11]
      );
      this._springs.push(spring0, spring1, spring2, spring3);
    }
    let points = [];
    for (let i = 0; i < 81; i++) {
      points.push(
        this._particles[i + 100],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9)],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9) + 1],
        this._particles[i + 100],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9) + 1],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9) + 11],
        this._particles[i + 100],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9) + 11],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9) + 10],
        this._particles[i + 100],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9) + 10],
        this._particles[Math.floor(i / 9) * 10 + Math.floor(i % 9)]
      );
    }
    this._plane = new Plane(
      this._event,
      this._notification,
      this._sceneGraph,
      points
    );
    this._updateFrequency = 0;
    /**
    this._ball = new Particle(
      this._event,
      this._notification,
      this._sceneGraph,
      1
    );
     
    this._ball.position.copy(new THREE.Vector3(20, 0, 20));
    this._ball.originPosition = this._ball.position.clone();
     */
  }

  public update(dt: number) {
    this._updateFrequency += dt;
    for (let i = 0; i < 60; i++) {
      if (this._start) {
        this._particles.forEach((particle) => {
          particle.applyForce(this.gravity);
          particle.applyForce(this.wind);
          particle.applyForce(
            particle.force.clone().negate().multiplyScalar(0.2)
          );
        });
        /**
        this._ball.applyForce(this.gravity);
        if (this._ball.collideGround()) {
          let d = this._ball.position
            .clone()
            .sub(new THREE.Vector3(0))
            .dot(new THREE.Vector3(0, 0.5, 0.5));
          let v = this._ball.velocity
            .clone()
            .dot(new THREE.Vector3(0, 0.5, 0.5));
          let vN = new THREE.Vector3(0, 0.5, 0.5).multiplyScalar(v);

          this._ball.position.sub(
            new THREE.Vector3(0, 0.5, 0.5).multiplyScalar(d)
          );
          if (v < 0.5) {
            this._ball.velocity.sub(vN);
          } else {
            this._ball.velocity.sub(vN.clone().multiplyScalar(0.5).add(vN));
          }
           
        }
         */
      } else {
        this._particles.forEach((particle) => {
          particle.reset();
        });
        this._springs.forEach((spring) => {
          spring.reset();
        });
        this._plane.reset();
        //this._ball.reset();
      }
    }
    this._particles.forEach((particle) => {
      particle.update();
    });
    this._springs.forEach((spring) => {
      spring.applyForce();
    });
    this._plane.update();
    //this._ball.update();
    this._particles[90].reset();
    this._particles[99].reset();
  }

  public checkDistance(particle: Particle) {
    if (particle.position.z < 0.5) {
      particle.position.setZ(0);
      particle.velocity.set(0, 0, 0);
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    if (event.key === 's' || event.key === 'S') {
      this._start = !this._start;
    }
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
  private _springs: Spring[];
  private _plane: Plane;
  private _start: boolean = false;
  private _updateFrequency: number;
  //private _ball: Particle;
}
