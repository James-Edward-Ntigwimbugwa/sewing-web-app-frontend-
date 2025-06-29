import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrousersComponent } from './trousers.component';

describe('TrousersComponent', () => {
  let component: TrousersComponent;
  let fixture: ComponentFixture<TrousersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrousersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrousersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
