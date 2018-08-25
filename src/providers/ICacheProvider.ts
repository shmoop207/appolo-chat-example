import {IClientData} from "../models/IClientData";

export interface ICacheProvider{
    addMessageToCache (room:string, clientData:IClientData, message:string):Promise<void>
    getMessagesFromCache (room:string):Promise<{message:string,clientData:IClientData}[]>
}