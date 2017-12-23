"use strict";
import appolo  =  require('appolo-http');
import {IEnv} from "../../config/environments/IEnv";

@appolo.define()
export class IndexController extends appolo.Controller{

    @appolo.inject() env:IEnv;

    @appolo.pathGet("*")
    public index(req:appolo.IRequest,res:appolo.IResponse){
        res.render("../../public/chat.html",{socketUrl:this.env.socketUrl});
    }
}