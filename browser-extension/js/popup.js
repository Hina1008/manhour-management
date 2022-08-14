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
    if(e.target.className.indexOf("start") != -1){
        // 再生ボタンを押したときの処理
        // 現在のタイマーをstorageに保存
        // カウントを初期化
        // 現在の設定をstorageに保存
        let manHourName = document.getElementById("manHourParagraph" + e.target.name).innerHTML;
        await bg.Mock(e.target.name);
        await bg.clickStartButton(manHourName, e.target.name);
        // intervalForTimerを再開する
        clearInterval(intervalForTimer);
        intervalForTimer = setInterval(intervalForMinute, 1000);
    }else if(e.target.className.indexOf("stop") != -1){
        // intervalForTimerを停止する
        clearInterval(intervalForTimer);
        await bg.clickStopButton();
    }else if(e.target.className.indexOf("delete") != -1){
        bg.Mock(e.target.className);
    }
 });