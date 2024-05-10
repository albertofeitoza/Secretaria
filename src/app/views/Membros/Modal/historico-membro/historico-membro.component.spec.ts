import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoMembroComponent } from './historico-membro.component';

describe('HistoricoMembroComponent', () => {
  let component: HistoricoMembroComponent;
  let fixture: ComponentFixture<HistoricoMembroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricoMembroComponent]
    });
    fixture = TestBed.createComponent(HistoricoMembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
