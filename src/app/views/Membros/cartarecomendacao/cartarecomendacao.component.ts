import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Endpoint } from 'src/app/enum/Endpoints';
import { Cartas } from 'src/app/models/Cartas';
import { PopupConfirm } from 'src/app/models/dialogConfirm';
import { TodasAsIgrejas } from 'src/app/models/Igreja';
import { Pessoa, ViewPessoa } from 'src/app/models/pessoa';
import { AllservicesService } from 'src/app/services/allservices.service';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-cartarecomendacao',
  templateUrl: './cartarecomendacao.component.html',
  styleUrls: ['./cartarecomendacao.component.css']
})
export class CartarecomendacaoComponent implements OnInit {

  resposta: PopupConfirm = new PopupConfirm();
  dados: Pessoa = new Pessoa();
  relatorioSelecionado: number = 0;
  comboCartas: any[]
  PastorIgreja = false;
  dadosSolicitacao: Cartas = new Cartas();
  pessoas: ViewPessoa[] = new Array();
  igrejas: TodasAsIgrejas[] = new Array();
  idIgrejaSelecionada = 0;
  constructor(private serviceUtil: UtilServiceService,
    public dialogRef: MatDialogRef<CartarecomendacaoComponent>,
    public dialog: MatDialog,
    private serviceApi: AllservicesService<any>,
    private auth: AutenticacaoService
  ) { }

  ngOnInit() {
    this.BuscarPessoa();
    this.CarregaCombos()
  }

  CarregaCombos() {
    this.comboCartas = this.serviceUtil.TipoCartas()
    this.BuscaObreiros();
    this.BuscarIgrejas();
  }

  BuscarPessoa() {
    this.serviceApi.readById(this.dialogRef.id, Endpoint.Pessoa)
      .subscribe(p => {
        this.dados = p.data.pessoa;
        this.PastorIgreja = p.data.pessoa.id === p.data.igreja.pastores[0].pessoaId ? true : false;
      })
  }

  private BuscaObreiros(): void {
    this.serviceApi.read(Endpoint.Pessoa + `/estabelecimento?igreja=${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: ViewPessoa[]) => {
        this.pessoas = result.filter(f => f.funcao != 'Membro' && f.funcao != 'PreCadastro' && f.statusPessoa != 'Inativo' && f.id != this.dados.id);
      });
  }

  private BuscarIgrejas(): void {
    this.serviceApi.read(Endpoint.Igreja + `/todasIgrejasDesdeSede/${this.auth.dadosUsuario.IgrejaLogada}`)
      .subscribe((result: TodasAsIgrejas[]) => {

        this.igrejas = [...result];
      });


  }

  FecharPopup(confirm: boolean) {

    if (confirm) {

      if (this.relatorioSelecionado == 14 && !this.dados.cpfConjuge || this.relatorioSelecionado == 16 && !this.dados.cpfConjuge) {
        this.serviceUtil.showMessage("Para emissão de carta de recomendação / Mudança para o casal corrigir o cadastro associando o cpf do conjuge.", true)
        return;
      }

      if (this.relatorioSelecionado === 15 && this.PastorIgreja || this.relatorioSelecionado === 22 && this.PastorIgreja) {
        this.serviceUtil.showMessage('Para emissão de carta de Mudança do pastor selecionar a opção "Carta de Mudança Casal. interna ou externa"', true)
        return;
      }

      if (this.relatorioSelecionado == 13) {

        this.resposta.Status = true;
        this.dadosSolicitacao.idPessoa = Number(this.dialogRef.id);
        this.dadosSolicitacao.tipoRelatorio = this.relatorioSelecionado;
        this.resposta.data = this.dadosSolicitacao
        this.dialogRef.close(this.resposta);
      }

      if (this.relatorioSelecionado == 14 && this.dados.estadoCivil == 1) {
        this.serviceUtil.showMessage("Uma pessoa solteiro(a) não pode emitir uma carta de recomendação de casal", true)
      }
      else {
        this.resposta.Status = true;
        this.dadosSolicitacao.idPessoa = Number(this.dialogRef.id);
        this.dadosSolicitacao.tipoRelatorio = this.relatorioSelecionado;
        this.dadosSolicitacao.nomeNovoPastor = this.pessoas.filter(x => x.id == this.dadosSolicitacao.idNovoPastor).map(x => x.nome).toString();
        this.dadosSolicitacao.idIgrejaInterna = this.idIgrejaSelecionada;
        this.resposta.data = this.dadosSolicitacao;
        this.dialogRef.close(this.resposta);
      }
    }
    else {
      this.resposta.Status = false;
      this.dialogRef.close(this.resposta)
    }

  }
}
