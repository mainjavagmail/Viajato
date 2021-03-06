import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Locacao } from 'app/shared/model/locacao.model';
import { LocacaoService } from './locacao.service';
import { LocacaoComponent } from './locacao.component';
import { LocacaoDetailComponent } from './locacao-detail.component';
import { LocacaoUpdateComponent } from './locacao-update.component';
import { LocacaoDeletePopupComponent } from './locacao-delete-dialog.component';
import { ILocacao } from 'app/shared/model/locacao.model';

@Injectable({ providedIn: 'root' })
export class LocacaoResolve implements Resolve<ILocacao> {
    constructor(private service: LocacaoService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((locacao: HttpResponse<Locacao>) => locacao.body));
        }
        return of(new Locacao());
    }
}

export const locacaoRoute: Routes = [
    {
        path: 'locacao',
        component: LocacaoComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'viajatoApp.locacao.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'locacao/:id/view',
        component: LocacaoDetailComponent,
        resolve: {
            locacao: LocacaoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'viajatoApp.locacao.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'locacao/new',
        component: LocacaoUpdateComponent,
        resolve: {
            locacao: LocacaoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'viajatoApp.locacao.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'locacao/:id/edit',
        component: LocacaoUpdateComponent,
        resolve: {
            locacao: LocacaoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'viajatoApp.locacao.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const locacaoPopupRoute: Routes = [
    {
        path: 'locacao/:id/delete',
        component: LocacaoDeletePopupComponent,
        resolve: {
            locacao: LocacaoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'viajatoApp.locacao.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
