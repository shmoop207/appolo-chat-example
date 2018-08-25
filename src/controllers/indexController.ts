"use strict";
import {controller, Controller, get, inject, IRequest, IResponse} from 'appolo';
import {IEnv} from "../../config/env/IEnv";

@controller()
export class IndexController extends Controller {

    @inject() env: IEnv;

    @get("*")
    public async index(req: IRequest, res: IResponse) {
        await res.render("../../public/chat.html", {socketUrl: this.env.socketUrl});
    }
}