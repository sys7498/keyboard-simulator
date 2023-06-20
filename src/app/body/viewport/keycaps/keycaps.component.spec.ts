import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeycapsComponent } from './keycaps.component';

describe('KeycapsComponent', () => {
  let component: KeycapsComponent;
  let fixture: ComponentFixture<KeycapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeycapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeycapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
