export let bg;
/**
 * バックグラウンドにRPCする呼び出し側の実装（manifestのcontent_scriptsに記述して配備すること）
 */
 'use strict';
 (() =>{
 
     function createAsyncRpcFunction(methodName) {
         return async function() {
             const req = {
                 method: methodName,
                 args: [].slice.apply(arguments)
             };
             return new Promise((resolve, reject)=>{
                 chrome.runtime.sendMessage(req, function(res){
                     if (res && ["OK","ERROR"].includes(res.status)) {
                         if (res.status == "OK") {
                             if (!res.data) {
                                 res.data = undefined;
                             }
                             try {
                                 resolve(res.data);
                             } catch(e) {
                                 console.error(`then-callback call failure!! ${e}`);
                                 reject(e);
                             }
                             return;
                         } else {
                             console.error(`RPC ${methodName} result ERROR!! ${JSON.stringify(res)}`);
                             reject(res);
                         }
                     } else {
                         console.error(`RPC return value of ${methodName} is no reply or unknown status!! ${res}`);
                         reject(res);
                     }
                 });
             });
         }
     }
 
     /**
      * RPCの仕掛け。
      */
     bg = new Proxy({}, {
             get: function(target, methodName){
                 if (methodName in target) {
                     return target[methodName];
                 }
                 return target[methodName] = createAsyncRpcFunction(methodName);
             }
         });
 
 })();