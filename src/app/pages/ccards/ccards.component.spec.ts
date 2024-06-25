import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcardsComponent } from './ccards.component';

describe('CcardsComponent', () => {
  let component: CcardsComponent;
  let fixture: ComponentFixture<CcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
