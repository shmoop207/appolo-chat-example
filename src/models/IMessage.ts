import {IClientData} from "./IClientData";

export interface IMessage{
    message:string,
    room:string,
    client:IClientData
}