import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoutComponent } from './sout.component';

describe('SoutComponent', () => {
  let component: SoutComponent;
  let fixture: ComponentFixture<SoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
