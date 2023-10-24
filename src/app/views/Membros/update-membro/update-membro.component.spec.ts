import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMembroComponent } from './update-membro.component';

describe('UpdateMembroComponent', () => {
  let component: UpdateMembroComponent;
  let fixture: ComponentFixture<UpdateMembroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateMembroComponent]
    });
    fixture = TestBed.createComponent(UpdateMembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
