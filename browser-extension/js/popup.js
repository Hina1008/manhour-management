import {bg} from './popup/backgroundCaller.js';
import {embeddingManHour} from'./popup/embeddingHtml.js';

let intervalForTimer;

'use strict';
(async () => {
    // バッヂを開いたとき
    await bg.pageCallUpdateInfo().then((manHourInfo) => {
        const keys = Object.keys(manHourInfo);
        // 親要素（div）への参照を取得
        const rootDiv = document.getElementById("root");
        for (let key of keys) {
            if(key != "name" && key != "time") {
                embeddingManHour(key, 
                    manHourInfo[key]["no"], 
                    getTime(manHourInfo[key]["time"]), 
                    rootDiv);
            }
        }
        intervalForTimer = setInterval(intervalForMinute, 1000);
    });
})();

let intervalForMinute = () => {
    bg.countTime().then((count) => {
        bg.getSelectManHour().then((manHourName) => {
            bg.getManHourInfo(manHourName).then((no) => {
                document.getElementById("manHourTime" + no).innerHTML = count;
            })
        }).catch((error) => {
            // nop
        });
    });
};

let getTime =(time) => {
	let hour  = ("0" + Math.trunc(time / (60 * 60 * 1000) % 24)).slice(-2);
	let minutes  = ("0" + Math.trunc(time / (60 * 1000) % 60)).slice(-2);
	let seconds = ("0" + Math.trunc(time / 1000 % 60)).slice(-2);
	let text = hour + ":" + minutes + ":" + seconds;
	return text;
};


document.addEventListener('DOMContentLoaded', function() {
    // 追加ボタンを押したとき
    document.querySelector('.add').addEventListener('click', ()=>{
        let value = document.getElementById("manhourNameBox").value;
        bg.clickAddButton(value).then((result) => {
            // 親要素（div）への参照を取得
            const rootDiv = document.getElementById("root");
            embeddingManHour(value, 
                result, 
                "00:00:00", 
                rootDiv);

        }).catch((error) => {
            bg.notification(value,"すでに登録されています");
        });
    });
});

document.addEventListener('click', async (e) =>{
    // アイコンである場合の処理
    if(e.target.className.includes("controller-icon")){
        let iconElement = document.getElementById(e.target.id);
        if(e.target.className.includes("start")){
            // 再生ボタンを押したときの処理
            let manHourName = document.getElementById("manHourParagraph" + e.target.name).innerHTML;
            await bg.clickStartButton(manHourName, e.target.name);

            clearInterval(intervalForTimer);
            intervalForTimer = setInterval(intervalForMinute, 1000);
        }else if(e.target.className.includes("stop")){
            // 停止ボタンを押したときの処理
            clearInterval(intervalForTimer);

            await bg.clickStopButton();
        }
        iconElement.style.position = 'relative';
        iconElement.style.top = "2px";
        setTimeout(() => {
            iconElement.style.top = "0px";
        }, 100);
    }
 });

 document.addEventListener('mouseover', async (e) =>{
    let iconElement = document.getElementById(e.target.id);
    if(e.target.id.indexOf("start") != -1){
        iconElement.setAttribute("src", "/img/popup/start/start_white.png");
    }else if (e.target.id.indexOf("stop") != -1){
        iconElement.setAttribute("src", "/img/popup/stop/stop_white.png");
    }
 });

 document.addEventListener("mouseout", async (e) =>{
    let iconElement = document.getElementById(e.target.id);
    if(e.target.id.indexOf("start") != -1){
        iconElement.setAttribute("src", "/img/popup/start/start.png");
    }else if (e.target.id.indexOf("stop") != -1){
        iconElement.setAttribute("src", "/img/popup/stop/stop.png");
    }
 });