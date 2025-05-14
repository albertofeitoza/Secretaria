import { UtilServiceService } from 'src/app/services/util-service.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AllservicesService } from 'src/app/services/allservices.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DocumentosDto } from '../../../model/viewDocumentos';
import { Endpoint } from 'src/app/enum/Endpoints';
import { TipoPopup } from 'src/app/enum/TipoPopup';
import { PopupConfirmacaoComponent } from 'src/app/popups/popup-confirmacao/popup-confirmacao.component';
import { TipoDocumento } from 'src/app/enum/TipoDocumento';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { PopupcomponetComponent } from 'src/app/popups/popupcomponet/popupcomponet.component';


@Component({
  selector: 'app-cadastro-documentos-pessoais',
  templateUrl: './cadastro-documentos-pessoais.component.html',
  styleUrls: ['./cadastro-documentos-pessoais.component.css']
})

export class CadastroDocumentosPessoaisComponent implements OnInit {
  origem = '';
  idDocumento = 0;
  pessoaId = 0;
  pessoaNome = '';
  cpfPessoa = '';
  dadosDocumento: DocumentosDto = new DocumentosDto();
  tipoDocumento: any[]
  tipoUsuario = 0;
  formData: FormData = new FormData();

  constructor(
    private toast: ToastrService,
    private serverApi: AllservicesService<any>,
    private serviceUtil: UtilServiceService,
    private dialogRef: MatDialogRef<CadastroDocumentosPessoaisComponent>,
    private auth: AutenticacaoService,
  ) { }

  ngOnInit() {
    this.origem = this.dialogRef._containerInstance._config.data.dadosTela.Origem;
    this.tipoUsuario = this.auth.dadosUsuario.TipoUsuarioLogado;
    this.pessoaId = this.dialogRef._containerInstance._config.data.dadosTela.PessoaId;
    this.pessoaNome = this.dialogRef._containerInstance._config.data.dadosTela.PessoaNome;
    this.cpfPessoa = this.dialogRef._containerInstance._config.data.dadosTela.PessoaCpf;
    this.idDocumento = this.dialogRef._containerInstance._config.data.dadosTela.IdDocumento;
    this.CarregarCombos();
    this.BuscarDocumento(this.idDocumento);
  }

  private CarregarCombos(): void {
    this.tipoDocumento = this.tipoUsuario === 2 ? this.serviceUtil.TipoDocumento().filter(x => x.id > 0) : this.serviceUtil.TipoDocumento();
  }


  private BuscarDocumento(idDocumento: number): void {
    if (idDocumento > 0) {
      this.serverApi.readById(idDocumento.toString(), Endpoint.DocumentosPessoais)
        .subscribe((result: any) => {
          this.dadosDocumento = result.data;
        })
    }
  }


  public CapturarFoto(textoImagem: any): void {


    this.serviceUtil.Popup(textoImagem, TipoPopup.Confirmacao, PopupcomponetComponent, 0, 'auto', 'auto', false, false, false)
      .subscribe(result => {
        if (result) {

          let blob = this.serviceUtil.ConverterUriImagemBlob(result.imageAsDataUrl)

          this.formData.append('file', blob);
          this.dadosDocumento.nomeArqFisico = "Foto_Capturada.jpeg";
        }
      },
        (error) => {
          this.toast.error("Problema pra excluir a foto do usuário!.");
        });

  }

  SelecionarArquivo(event: any) {

    this.cpfPessoa = this.cpfPessoa.replace(/\D/g, '');
    this.cpfPessoa = ("00000000000" + this.cpfPessoa).slice(-11);

    if (event.target.files && event.target.files[0] && this.serviceUtil.ValidaCpf(this.cpfPessoa)) {

      const file = <File>event.target.files[0];

      if (this.dadosDocumento.tipoDocumento === TipoDocumento.FotoPerfil) {

        switch (file.type) {
          case "image/jpg":
          case "image/jpeg":
            break;

          default:
            this.toast.warning("Para o documento Foto de perfil, é obriogatório enviar uma imagem JPG ou JPEG");
            return;
        }
      }

      if (this.dadosDocumento.tipoDocumento > TipoDocumento.FotoPerfil) {

        switch (file.type) {
          case "image/jpg":
          case "image/jpeg":
          case "application/pdf":
            break;

          default:
            this.toast.warning("Para envio de documentos, é obriogatório enviar uma imagem JPG, JPEG ou um PDF.");
            return;
        }
      }
      this.formData.append('file', file)
      this.dadosDocumento.nomeArqFisico = file.name;

    }
  }

  RemoverDocumento() {
    this.serviceUtil.Popup("Deseja excluir a foto de perfil ? ", TipoPopup.Confirmacao, PopupConfirmacaoComponent, 0, 'auto', 'auto', false, false, false)
      .subscribe(result => {
        if (result.Status) {
          this.serverApi.readById(this.pessoaId.toString(), Endpoint.RemoverFotoDocumento)
            .subscribe(() => {
              this.toast.success("Imagem removida com sucesso!");

            })
        }
      },
        (error) => {
          this.toast.error("Problema pra excluir a foto do usuário!.");
        });
  }

  public Salvar(): void {

    if (!this.formData)
      this.toast.warning("Selecione o arquivo.")

    this.dadosDocumento.pessoaId = this.pessoaId;

    this.serverApi.create(this.dadosDocumento, Endpoint.DocumentosPessoais)
      .subscribe(result => {
        this.EnviarArquivoServidor(result);
      }, (err) => {
        this.toast.error("Erro ao criar o cadastro do arquivo.")
      });
  }

  private EnviarArquivoServidor(idDocumento: number): void {

    const filtros = {
      idpessoa: this.pessoaId,
      iddocumento: idDocumento,
      tipodocumento: this.dadosDocumento.tipoDocumento
    }

    this.serverApi.EnviarArquivoServidor(this.formData, Endpoint.UploadFiles, filtros)
      .subscribe(result => {
        this.dialogRef.close(true);
      }, (err) => {
        this.toast.error("Erro ao importar o arquivo para o servidor." + err.message)
      })
  }

}
