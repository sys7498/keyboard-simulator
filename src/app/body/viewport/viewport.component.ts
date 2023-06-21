import { Component, ElementRef, ViewChild } from '@angular/core';


import { NIndex, NotificationService, NotifyHandler } from 'src/app/notification-service/notification-service';
import { SceneGraphService } from 'src/app/scene-graph-service/scene-graph-service';
import { EventHandler, EventService, EventType } from '../../event-service/event-service';

@Component({
    selector: 'app-viewport',
    templateUrl: './viewport.component.html',
    styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent {
    /* 뷰포트 div 요소 */
    @ViewChild('viewport', { static: true }) viewport: ElementRef;
    @ViewChild('paragraph', { static: true }) paragraph: ElementRef;
    constructor(
        private _event: EventService,
        private _notification: NotificationService,
        public sceneGraph: SceneGraphService,
    ) {
        this.viewport = undefined as unknown as ElementRef;
        this.paragraph = undefined as unknown as ElementRef;
        this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
        this._eventHandler = new EventHandler(this._event);
        this._eventHandler.set(EventType.OnKeyDown, this.onKeyDown.bind(this));
        this._eventHandler.set(EventType.OnKeyUp, this.onKeyUp.bind(this));
        this._eventHandler.set(EventType.OnInput, this.onInput.bind(this));
    }

    ngAfterViewInit(): void {
        this._event.isEnabled = true;
        this._notification.isEnabled = true;
		/* 서비스 중 뷰포트 div 요소가 필요한 부분을 초기화하고 UI의 초깃값을 일괄 적용 */
        this._notification.notify(NIndex.createdViewportDiv, this.viewport.nativeElement);
    }

    private onKeyDown(event: KeyboardEvent): void {
        this.paragraph.nativeElement.focus();
    }
    private onKeyUp(event: KeyboardEvent): void {
    }
    private onInput(event: InputEvent): void {
    }

    private onNotify(nid: number, params: any, sender: any): void {
        switch (nid) {
        }
    }

    private _notifyHandler: NotifyHandler;
    private _eventHandler: EventHandler;
}