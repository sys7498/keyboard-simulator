import { Component, ElementRef, ViewChild } from '@angular/core';
import { Color } from 'three';
import { NotificationService, NotifyHandler, NIndex } from '../notification-service/notification-service';
import { EventHandler } from '../event-service/event-service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
@ViewChild('background', { static: true }) background: ElementRef = undefined as unknown as ElementRef;

	/** 왼쪽 메뉴 표시 여부 */
	public isVisibleLeftMenu: boolean = true;
	/** 오른쪽 메뉴 표시 여부 */
	public isVisibleRightMenu: boolean = true;

	/** 생성자
	 * @param _event 이벤트 서비스
	 * @param notification 알림 서비스
	 */
	constructor(
		private _notification: NotificationService) {
		this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
	}

	public onChangeMenu() {
		this._notifyHandler.notify(NIndex.resizedClientSize);
	}

	/** 알림 수신 콜백 메서드 */
    private onNotify(nid: number, params: any, sender: any): void {
		switch (nid) {}
	}


	/** 알림 사용 */
	private _notifyHandler: NotifyHandler;

}
