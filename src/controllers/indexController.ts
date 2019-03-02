"use strict";
import {controller, Controller, get, inject, IRequest, IResponse} from 'appolo';
import {view} from '@appolo/view';
import {IEnv} from "../../config/env/IEnv";

@controller()
export class IndexController extends Controller {

    @inject() env: IEnv;

    @get("*")
    @view("../../public/chat.html")
    public async index(req: IRequest, res: IResponse) {
        return {socketUrl: this.env.socketUrl};
    }
}