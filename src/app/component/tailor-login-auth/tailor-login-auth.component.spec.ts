import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailorLoginAuthComponent } from './tailor-login-auth.component';

describe('TailorLoginAuthComponent', () => {
  let component: TailorLoginAuthComponent;
  let fixture: ComponentFixture<TailorLoginAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailorLoginAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailorLoginAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
