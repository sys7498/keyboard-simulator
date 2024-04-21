import { NotificationService, NotifyHandler } from 'src/app/notification-service/notification-service';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { SceneGraphService } from '../scene-graph-service';
import { CameraSet } from '../camera/camera-set';
import { EventHandler, EventService, EventType } from 'src/app/event-service/event-service';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

export class Renderer{
    public webGLRenderer: THREE.WebGLRenderer;
    public css3DRenderer: CSS3DRenderer;
	constructor(
		event: EventService,
        notification: NotificationService,
        sceneGraph: SceneGraphService,
        cameraSet: CameraSet,
	) {
        this.webGLRenderer = this.createWebGLRenderer();
        this.css3DRenderer = this.createCSS3DRenderer();
        this._sceneGraph = sceneGraph;
        this._viewportDiv = undefined as unknown as HTMLDivElement;
		this._cameraSet = cameraSet;
		this._eventHandler = new EventHandler(event);
		this._eventHandler.set(EventType.OnWindowResize, this.onWindowResize.bind(this));
        this._notifyHandler = new NotifyHandler(notification, this.onNotify.bind(this));
    }

    /** 초기화 메서드
	 * @param viewportDiv 뷰포트 div 요소
	 */
	initialize(viewportDiv: HTMLDivElement) {
		this._viewportDiv = viewportDiv;
		this._viewportDiv.appendChild(this.webGLRenderer.domElement);
		this._viewportDiv.appendChild(this.css3DRenderer.domElement);
		this.onWindowResize();
    }

    /** 렌더 메서드 */
	onRender() {
		this.webGLRenderer.clear();
		this.webGLRenderer.render(this._sceneGraph.scene, this._cameraSet.camera);
		this.webGLRenderer.clearDepth();
		this.css3DRenderer.render(this._sceneGraph.scene, this._cameraSet.camera);
    }
    
    private onNotify(nid: number, params: any, sender: any) {
		switch (nid) {
		}
	}

    /** 창 크기가 변경될 경우 호출되는 메서드 */
	private onWindowResize() {
		this.webGLRenderer.setSize(this._viewportDiv.clientWidth, this._viewportDiv.clientHeight);
		this.css3DRenderer.setSize(this._viewportDiv.clientWidth, this._viewportDiv.clientHeight);
	}

    /** WebGL 렌더러를 생성하고 반환하는 메서드 */
	private createWebGLRenderer(): THREE.WebGLRenderer {
		const webGLRenderer = new THREE.WebGLRenderer({ antialias: true });
		webGLRenderer.autoClear = false;
		webGLRenderer.domElement.style.touchAction = 'none';
		return webGLRenderer;
	}

	/** CSS2D 렌더러를 생성하고 반환하는 메서드 */
	private createCSS3DRenderer(): CSS3DRenderer {
		const css3DRenderer = new CSS3DRenderer();
		css3DRenderer.domElement.style.touchAction = 'none';
		css3DRenderer.domElement.style.position = 'absolute';
		css3DRenderer.domElement.style.top = '0px';
		return css3DRenderer;
	}
	
	private _eventHandler: EventHandler;
    private _notifyHandler: NotifyHandler;
    
    private _viewportDiv: HTMLDivElement;
    private _sceneGraph: SceneGraphService;
    private _cameraSet: CameraSet;
}