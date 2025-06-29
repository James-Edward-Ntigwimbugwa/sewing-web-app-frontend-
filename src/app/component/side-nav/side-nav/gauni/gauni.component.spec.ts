import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GauniComponent } from './gauni.component';

describe('GauniComponent', () => {
  let component: GauniComponent;
  let fixture: ComponentFixture<GauniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GauniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GauniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
