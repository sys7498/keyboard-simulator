import { Component, HostListener } from '@angular/core';
import { NIndex, NotificationService, NotifyHandler } from './notification-service/notification-service';
import { AnyEvent, EventService, EventType } from './event-service/event-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private _event: EventService,
		private _notification: NotificationService) {
		this._viewportDiv = undefined as unknown as HTMLDivElement;
		this._viewportRect = undefined as unknown as DOMRect;
		this._notifyHandler = new NotifyHandler(this._notification, this.onNotify.bind(this));
    }
    
    
	/** 창 크기가 변경될 경우 호출되는 메서드 */
	@HostListener('window:resize')
	onWindowResize(): void {
		this._viewportRect = this._viewportDiv.getBoundingClientRect();
		this._event.emit(EventType.OnWindowResize, undefined as unknown as AnyEvent);
	}

	/** 마우스 휠을 움직일 경우 호출되는 메서드 */
	@HostListener('window:mousewheel', ['$event'])
	onMouseWheel(event: MouseEvent): void {
		if (this.isMouseInViewport(event)) {
			this._event.emit(EventType.OnMouseWheel, event as AnyEvent);
		}
	}

	/** 마우스를 움직일 경우 호출되는 메서드 */
	@HostListener('window:mousemove', ['$event'])
	onMouseMove(event: MouseEvent): void {
		if (this.isMouseInViewport(event)) {
			this._event.emit(EventType.OnMouseMove, event as AnyEvent);
		}
	}

	/** 마우스 버튼을 누를 경우 호출되는 메서드 */
	@HostListener('window:mousedown', ['$event'])
	onMouseDown(event: MouseEvent): void {
		this._event.emit(EventType.OnMouseDown, event as AnyEvent);
	}

	/** 마우스 버튼을 뗄 경우 호출되는 메서드 */
	@HostListener('window:mouseup', ['$event'])
	onMouseUp(event: MouseEvent): void {
		this._event.emit(EventType.OnMouseUp, event as AnyEvent);
	}

	@HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent): void {
		let isPreventDefault = false;
		// for (const condition of this._config.key.preventDefaultConditions) {
		// 	if (condition(event)) { isPreventDefault = true; break; }
		// }
		if (isPreventDefault) { event.preventDefault(); }
		this._event.emit(EventType.OnKeyDown, event as AnyEvent);
	}

	/** 키보드 버튼을 뗄 경우 호출되는 메서드 */
	@HostListener('window:keyup', ['$event'])
	onKeyUp(event: KeyboardEvent): void {
		this._event.emit(EventType.OnKeyUp, event as AnyEvent);
	}

	/** 마우스 오른쪽 버튼을 누를 경우 발생하는 컨텍스트 메뉴 비활성화 */
	@HostListener('window:contextmenu', ['$event'])
	onContextMenu(event: MouseEvent) {
		//event.preventDefault();
	}

	@HostListener('window:input', ['$event'])
	onInput(event: InputEvent): void {
		this._event.emit(EventType.OnInput, event as AnyEvent);
	}

	/** 알림 수신 콜백 메서드 */
	private onNotify(nid: number, params: any, sender: any): void {
		switch (nid) {
			case NIndex.createdViewportDiv: {
				this._viewportDiv = params as HTMLDivElement;
				this._viewportRect = this._viewportDiv.getBoundingClientRect();
			} break;
			case NIndex.resizedClientSize: {
				console.log("hello")
				this._viewportRect = this._viewportDiv.getBoundingClientRect();
				this.onWindowResize();
			} break;
		}
	}

	/** 마우스가 뷰포트 내부에 있는지 검사하고 결과를 반환하는 메서드
	 * @return 마우스가 뷰포트 내부에 있는지 여부
	 */
	private isMouseInViewport(event: MouseEvent): boolean {
		return (this._viewportRect.left <= event.clientX && event.clientX <= this._viewportRect.right) &&
			(this._viewportRect.top <= event.clientY && event.clientY <= this._viewportRect.bottom);
	}

	/** 뷰포트 div 요소 */
	private _viewportDiv: HTMLDivElement;
	/** 뷰포트 영역 */
	private _viewportRect: DOMRect;
	/** 알림 사용 */
	private _notifyHandler: NotifyHandler;

}
