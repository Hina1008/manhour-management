import {bg} from './popup/backgroundCaller.js';
import {embeddingManHour, emmbeddingErrorMessage} from'./popup/embeddingHtml.js';

let intervalForTimer;

'use strict';
(async () => {
    // バッヂを開いたとき
    await bg.pageCallUpdateInfo().then((manHourInfo) => {
        const keys = Object.keys(manHourInfo);
        // 親要素（div）への参照を取得
        const rootDiv = document.getElementById("root");
        for (let key of keys) {
            if(key != "name" && key != "time" && key != "localStorage" && key != "startTime") {
                embeddingManHour(key, 
                    manHourInfo[key]["no"], 
                    getTime(manHourInfo[key]["time"]+manHourInfo[key]["diffTime"]), 
                    rootDiv);
            }
        }
        intervalForMinute();
    });
})();

let emmbedingHtml = (manHourInfo) =>{
    const keys = Object.keys(manHourInfo);
    for (let key of keys) {
        if(key != "name" && key != "time" && key != "localStorage" && key != "startTime") {
            let manHourTime = document.getElementById("manHourTime" + manHourInfo[key]["no"]);
            if(manHourTime){
                manHourTime.innerHTML = getTime(manHourInfo[key]["time"] + manHourInfo[key]["diffTime"]);
            }
        }
    }
}

let intervalForMinute = () => {
    clearInterval(intervalForTimer);
    intervalForTimer = setInterval(intervalForMinute, 1000);
    bg.getSelectManHour().then((manHourName) => {
        bg.getManHourInfo(manHourName).then((manHourInfo) => {
            let no = manHourInfo["no"];
            let time = manHourInfo["time"] + manHourInfo["diffTime"];
            document.getElementById("manHourTime" + no).innerHTML = getTime(time);
        })
    }).catch((error) => {
        // nop
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

        }).catch(async (error) => {
            let message = value + " は既に登録されています。"
            emmbeddingErrorMessage(message, "duplication");
            bg.notification(value, value + 'は既に登録されています。');
        });
    });

    // リセットボタンを押したとき
    document.querySelector('.reset').addEventListener('click', async ()=>{
        clearInterval(intervalForTimer);
        await bg.clickResetButton().then((manHourInfo) =>{
            emmbedingHtml(manHourInfo);
        });
    });

    // 停止ボタンを押した時
    document.querySelector('.all-stop').addEventListener('click', async ()=>{
        clearInterval(intervalForTimer);
        await bg.clickAllStopButton();
    });
});

document.addEventListener('click', async (e) =>{
    // アイコンである場合の処理
    if(e.target.className.includes("controller-icon")){
        let iconElement = document.getElementById(e.target.id);
        iconElement.style.position = 'relative';
        iconElement.style.top = "2px";
        setTimeout(() => {
            iconElement.style.top = "0px";
        }, 100);

        if(e.target.className.includes("start")){
            // 再生ボタンを押したときの処理
            let manHourName = document.getElementById("manHourParagraph" + e.target.name).innerHTML;
            await bg.clickStartButton(manHourName, e.target.name);

            intervalForMinute();
        }else if(e.target.className.includes("stop")){
            let isCurrentManHour = await bg.clickStopButton(e.target.name);
            if(isCurrentManHour){
                // 停止ボタンを押したときの処理
                clearInterval(intervalForTimer);
            }
        }else if(e.target.className.includes("delete")){
            // 削除ボタンを押したときの処理
            let manHourName = document.getElementById("manHourParagraph" + e.target.name).innerHTML;
            await bg.clickDeleteButton(manHourName);
            let deleteManHourDiv = document.getElementById("manHour" + e.target.name);
            deleteManHourDiv.remove();
        }
    }
 });

 // マウスが要素上にあるときの処理
 document.addEventListener('mouseover', async (e) =>{
    // アイコンである場合の処理
    let iconElement = document.getElementById(e.target.id);
    if(e.target.id.includes("start")){
        iconElement.setAttribute("src", "/img/popup/start/start_white.png");
    }else if (e.target.id.includes("stop")){
        iconElement.setAttribute("src", "/img/popup/stop/stop_white.png");
    }else if (e.target.id.includes("delete")){
        iconElement.setAttribute("src", "/img/popup/delete/delete_white.png");
    }
 });

 // マウスが要素から出るときの処理
 document.addEventListener("mouseout", async (e) =>{
    // アイコンである場合の処理
    let iconElement = document.getElementById(e.target.id);
    if(e.target.id.includes("start")){
        iconElement.setAttribute("src", "/img/popup/start/start.png");
    }else if (e.target.id.includes("stop")){
        iconElement.setAttribute("src", "/img/popup/stop/stop.png");
    }else if (e.target.id.includes("delete")){
        iconElement.setAttribute("src", "/img/popup/delete/delete.png");
    }
 });