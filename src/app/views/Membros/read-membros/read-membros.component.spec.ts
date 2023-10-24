import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMembrosComponent } from './read-membros.component';

describe('ReadMembrosComponent', () => {
  let component: ReadMembrosComponent;
  let fixture: ComponentFixture<ReadMembrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadMembrosComponent]
    });
    fixture = TestBed.createComponent(ReadMembrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
