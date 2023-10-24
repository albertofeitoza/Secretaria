import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMembroComponent } from './delete-membro.component';

describe('DeleteMembroComponent', () => {
  let component: DeleteMembroComponent;
  let fixture: ComponentFixture<DeleteMembroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteMembroComponent]
    });
    fixture = TestBed.createComponent(DeleteMembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
