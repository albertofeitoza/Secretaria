import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMembrosComponent } from './cadastro-membros.component';

describe('CadastroMembrosComponent', () => {
  let component: CadastroMembrosComponent;
  let fixture: ComponentFixture<CadastroMembrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroMembrosComponent]
    });
    fixture = TestBed.createComponent(CadastroMembrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
