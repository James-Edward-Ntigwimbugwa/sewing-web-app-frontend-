import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorRegistrationComponent } from './tailor-registration.component';

describe('TailorRegistrationComponent', () => {
  let component: TailorRegistrationComponent;
  let fixture: ComponentFixture<TailorRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailorRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
