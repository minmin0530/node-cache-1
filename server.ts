
import express from "express"
import {Request, Response} from "express"
//const express = require('express');
 
/// NodeCahceを生成
const NodeCache = require( "node-cache" );
const nodeCache = new NodeCache();
 
const app = express();
 
interface Cookies {
    sessionId:string
}

app.get("/", (req: Request, res: Response) => {
//    console.log(req.headers);
    const cookies = cookieParser(req);
    const sessionId = cookies.sessionId;
    if (nodeCache.has(sessionId)){
        res.redirect("http://localhost:5173");
    } else {
        res.redirect("http://localhost:5173/login.html");
    }
})

app.post("/login", (req: Request, res: Response) => {
    const sid = createSessionId();
    res.setHeader('Set-Cookie', `sessionId=${sid};`);
    res.redirect("http://localhost:5173");
})


const cookieParser:(str:Request|undefined) => Cookies = (str)=> {
    if(!str) return {sessionId:''};
    if(!str.headers.cookie) return {sessionId:''};
    const cookies = {sessionId:''};
    str.headers.cookie.split(';').forEach((cookie)=>{
        let parts = cookie.split('=');
        let key = parts[0].trim();
        let value = parts[1];
        let part = {[key]: value}
        Object.assign(cookies, part);
        console.log(part);
    });
    console.log(str.headers.cookie);
    console.log(cookies);
    return cookies;
}

const createSessionId:() => string = () => {
    const newSessionId = "hogehoge";//`hogehoge_${new Date().toISOString()}`;
    nodeCache.set(newSessionId, "", 60);
    return newSessionId;
}

app.listen(3000, () => {
    console.log("http://localhost:3000");
})