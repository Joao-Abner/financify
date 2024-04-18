import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AloMundoComponent } from './alo-mundo.component';

describe('AloMundoComponent', () => {
  let component: AloMundoComponent;
  let fixture: ComponentFixture<AloMundoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AloMundoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AloMundoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
