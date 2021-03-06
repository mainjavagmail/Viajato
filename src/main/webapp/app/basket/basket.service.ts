import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAeroporto } from 'app/shared/model/aeroporto.model';
import { Compra } from 'app/shared/model/compra.model';
import { IPassagem } from 'app/shared/model/passagem.model';
import { ILocacao } from 'app/shared/model/locacao.model';
import { IContrato } from 'app/shared/model/contrato.model';
import { IReserva } from 'app/shared/model/reserva.model';
import { PassagemService } from 'app/entities/passagem';
import { LocacaoService } from 'app/entities/locacao';
import { ReservaService } from 'app/entities/reserva';
import { ContratoService } from 'app/entities/contrato';
import { CompraService } from 'app/entities/compra';
import { User } from 'app/core';

type EntityResponseType = HttpResponse<IAeroporto>;
type EntityArrayResponseType = HttpResponse<IAeroporto[]>;

declare var $: any;

@Injectable({ providedIn: 'root' })
export class BasketService {
    compra = new Compra();
    passagens = new Array<IPassagem>();
    locacoes = new Array<ILocacao>();
    reservas = new Array<IReserva>();
    contratos = new Array<IContrato>();
    totalItems: number = 0;

    constructor(
        private passagemService: PassagemService,
        private locacaoService: LocacaoService,
        private reservaService: ReservaService,
        private contratoService: ContratoService,
        private compraService: CompraService
    ) {}

    // Salva as compras realizadas
    savePayment(user) {
        this.compra.user = user;
        console.log('basketservice');
        console.log(this.compra);

        // Verifica se a cesta nao esta vazia
        if (!this.isEmpty()) {
            // Cria a compra, pega o objeto compra, o seta em cada parte da compra e salva tudo no banco
            this.compraService.create(this.compra).subscribe(res => {
                this.compra = res.body;
                console.log('res compra');
                console.log(this.compra);

                this.locacoes.forEach(locacao => {
                    locacao.compra = this.compra;
                    this.subscribeToSaveResponse(this.locacaoService.create(locacao));
                });
                this.passagens.forEach(passagem => {
                    passagem.compra = this.compra;
                    this.subscribeToSaveResponse(this.passagemService.create(passagem));
                });
                this.reservas.forEach(reserva => {
                    reserva.compra = this.compra;
                    this.subscribeToSaveResponse(this.reservaService.create(reserva));
                });
                this.contratos.forEach(contrato => {
                    contrato.compra = this.compra;
                    this.subscribeToSaveResponse(this.contratoService.create(contrato));
                });
                console.log(this.contratos);

                this.cleanBasket();
            });
        }
    }

    // Limpa a cesta
    cleanBasket() {
        this.compra = new Compra();
        this.passagens = new Array<IPassagem>();
        this.locacoes = new Array<ILocacao>();
        this.reservas = new Array<IReserva>();
        this.contratos = new Array<IContrato>();
    }

    resizeConfirmationWindow() {
        this.totalItems = this.passagens.length + this.locacoes.length + this.reservas.length + this.contratos.length;
        $('.confirmation-window').height(124 + this.totalItems * 31);
    }

    // Remove uma dada passagem do carrinho:
    removePassagem(passagem) {
        var index = this.passagens.indexOf(passagem);
        if (index > -1) {
            this.passagens.splice(index, 1);
        }
        this.resizeConfirmationWindow();
    }

    // Remove uma dada reserva do carrinho:
    removeReserva(reserva) {
        var index = this.reservas.indexOf(reserva);
        if (index > -1) {
            this.reservas.splice(index, 1);
        }
        this.resizeConfirmationWindow();
    }

    // Remove uma dada reserva do carrinho:
    removeContrato(contrato) {
        var index = this.contratos.indexOf(contrato);
        if (index > -1) {
            this.contratos.splice(index, 1);
        }
        this.resizeConfirmationWindow();
    }

    // Remove uma dada locacao do carrinho:
    removeLocacao(locacao) {
        var index = this.locacoes.indexOf(locacao);
        if (index > -1) {
            this.locacoes.splice(index, 1);
        }
        this.resizeConfirmationWindow();
    }

    // Returns true if list has obj, false otherwise:
    containsFlight(voo, assento) {
        var i;
        for (i = 0; i < this.passagens.length; i++) {
            if (this.passagens[i].voo.id === voo && this.passagens[i].assento == assento) {
                return true;
            }
        }
        return false;
    }

    // Returns true if list has obj, false otherwise:
    containsRoom(obj) {
        var i;
        for (i = 0; i < this.reservas.length; i++) {
            if (this.reservas[i].quarto.id === obj.id) {
                return true;
            }
        }
        return false;
    }

    // Returns true if list has obj, false otherwise:
    containsInsurance(obj) {
        var i;
        for (i = 0; i < this.contratos.length; i++) {
            if (this.contratos[i].seguro.id === obj.id) {
                return true;
            }
        }
        return false;
    }

    // Returns true if list has obj, false otherwise:
    containsVehicle(obj) {
        var i;
        for (i = 0; i < this.locacoes.length; i++) {
            if (this.locacoes[i].veiculo.id === obj.id) {
                return true;
            }
        }
        return false;
    }

    // Verifica o response da call rest
    private subscribeToSaveResponse(result: Observable<HttpResponse<IContrato>>) {
        result.subscribe((res: HttpResponse<IContrato>) => console.log(res), (res: HttpErrorResponse) => console.log(res));
    }

    // Verifica se a cesta esta vazia
    isEmpty() {
        if (this.passagens.length > 0 || this.locacoes.length > 0 || this.reservas.length > 0 || this.contratos.length > 0) {
            return false;
        }
        return true;
    }
}
