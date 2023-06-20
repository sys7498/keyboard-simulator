import { Component, ElementRef, ViewChild } from '@angular/core';
import { NIndex, NotificationService, NotifyHandler } from 'src/app/notification-service/notification-service';
import { SceneGraphService } from 'src/app/scene-graph-service/scene-graph-service';
import { EventService } from '../../event-service/event-service';

@Component({
    selector: 'app-viewport',
    templateUrl: './viewport.component.html',
    styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent {
    /* 뷰포트 div 요소 */
    @ViewChild('viewport', { static: true }) viewport: ElementRef;
    constructor(
        private _event: EventService,
        private _notification: NotificationService,
        private _sceneGraph: SceneGraphService,
    ) {
        this.viewport = undefined as unknown as ElementRef;
        this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
    }

    ngAfterViewInit(): void {
        this._event.isEnabled = true;
        this._notification.isEnabled = true;
		/* 서비스 중 뷰포트 div 요소가 필요한 부분을 초기화하고 UI의 초깃값을 일괄 적용 */
        this._notification.notify(NIndex.createdViewportDiv, this.viewport.nativeElement);
    }

    private onNotify(nid: number, params: any, sender: any): void {
        switch (nid) {
        }
    }

    private _notifyHandler: NotifyHandler;
}