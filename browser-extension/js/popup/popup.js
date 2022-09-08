import {bg} from './backgroundCaller.js';
import {embeddingManHour, emmbeddingErrorMessage, deleteErrorMessage} from'./embeddingHtml.js';
import {seekIcon} from './seekId.js';

let intervalForTimer;

'use strict';
(async () => {
    // バッヂを開いたとき
    await bg.pageCallUpdateInfo().then((manHourInfo) => {
        const keys = Object.keys(manHourInfo);
        // 親要素（div）への参照を取得
        const rootDiv = document.getElementById("root");
        for (let key of keys) {
            if(key != "currentManHourIndex" && key != "time" && key != "localStorage" && key != "startTime") {
                embeddingManHour(
                    manHourInfo[key]["name"], 
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
        if(key != "currentManHourIndex" && key != "time" && key != "localStorage" && key != "startTime") {
            let homeTime = document.getElementById("manHourTime" + manHourInfo[key]["no"] + "-1");
            let editTime = document.getElementById("manHourTime" + manHourInfo[key]["no"] + "-2");
            let time = getTime(manHourInfo[key]["time"] + manHourInfo[key]["diffTime"]);
            homeTime.innerHTML = time;
            editTime.innerHTML = time;
        }
    }
}

let intervalForMinute = () => {
    clearInterval(intervalForTimer);
    intervalForTimer = setInterval(intervalForMinute, 1000);
    bg.getCurrentManHourInfo().then((manHourInfo) => {
        let no = manHourInfo["no"];
        let time = manHourInfo["time"] + manHourInfo["diffTime"];
        let formIndex = manHourInfo["formIndex"];
        console.log(time);
        document.getElementById("manHourTime" + no + "-" + formIndex).innerHTML = getTime(time);
    })
};

let getTime =(time) => {
	let hour  = ("0" + (Math.trunc(time / (60 * 60 * 1000) % 24)|0)).slice(-2);
	let minutes  = ("0" +(Math.trunc(time / (60 * 1000) % 60)|0)).slice(-2);
	let seconds = ("0" + (Math.trunc(time / 1000 % 60)|0)).slice(-2);
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
            deleteErrorMessage(
                document.getElementById("errorMessage")
            );

        }).catch(async (error) => {
            let message;
            console.log(error["error"]);
            if (error["error"] == "duplication"){
                message = value + " は既に登録されています。";
            }else if(error["error"] == "forbidden word"){
                message = "全角「＆」 は使用できません。"
            }else if(error["error"] == "empty"){
                message = "工数名が空です。 工数名を入力してください。"
            } 
            emmbeddingErrorMessage(message, "errorMessage", "error", "error-content");
            const useNotification = await bg.getOptionValue("notification")
            if (useNotification){
                bg.notification(value, value + 'は既に登録されています。');
            }
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
        const no = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
        const manHourInfo = await bg.checkCurrentManHourInfo(no);
        const formIndex = manHourInfo["formIndex"];
        let iconElement = document.getElementById(e.target.id);
        iconElement.style.position = 'relative';
        iconElement.style.top = "2px";
        setTimeout(() => {
            iconElement.style.top = "0px";
        }, 100);
        if(e.target.id == "start" + no + "-" + formIndex){
            // 再生ボタンを押したときの処理
            let manHourName = document.getElementById("manHourName" + no + "-" + formIndex).innerHTML;
            await bg.clickStartIcon(no);

            intervalForMinute();
        }else if(e.target.id == "stop" + no + "-" + formIndex){
            let isCurrentManHour = await bg.clickStopIcon(no);
            if(isCurrentManHour){
                // 停止ボタンを押したときの処理
                clearInterval(intervalForTimer);
            }
        }else if(e.target.id == "delete" + no + "-" + formIndex){
            // 削除ボタンを押したときの処理
            await bg.clickDeleteIcon(no);
            let deleteManHourDiv = document.getElementById(no);
            deleteManHourDiv.remove();
        }else if(e.target.id == "right" + no + "-" + formIndex){
            // 右矢印を押した時の処理
            await bg.updateCurrentForm(no, "right");
            let ul = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('ul');
            console.log(e.target.parentNode.parentNode.parentNode.parentNode);
            console.log(ul);
            console.log(ul.scrollLeft);
            console.log(ul.clientWidth);
            // let value = await bg.subFormIndex(formIndex, "right")
            let children = ul.childNodes;
            console.log(ul.lastElementChild);
            console.log(e.target.parentNode.parentNode.parentNode)
            if(ul.lastElementChild == e.target.parentNode.parentNode.parentNode){
                ul.appendChild(ul.firstElementChild);
                // ul.firstElementChild.remove();
            }
            ul.scrollLeft += ul.clientWidth;
        }else if(e.target.id == "left" + no + "-" + formIndex){
            // 左矢印を押した時の処理
            await bg.updateCurrentForm(no, "left");
            let ul = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('ul');
            console.log(ul.scrollLeft);
            console.log(ul.clientWidth);
            // let value = await bg.subFormIndex(formIndex,"left")
            if(ul.firstElementChild == e.target.parentNode.parentNode.parentNode){
                ul.prepend(ul.lastElementChild);
            }
            ul.scrollLeft -= ul.clientWidth;
        }
    }
 });

 // マウスが要素上にあるときの処理
 document.addEventListener('mouseover', async (e, undefined) =>{
    // アイコンである場合の処理
    let iconElement = document.getElementById(e.target.id);
    let icon = seekIcon(e.target);
    if(icon !== undefined){
        console.log(icon)
        const no = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
        if(icon == "edit" && document.getElementById("manHourEditForm" + no + "-" + formIndex)){
            return ;
        }
        iconElement.setAttribute("src", "/img/popup/" + icon + "/" + icon + "_white.png")
    }
 });

 // マウスが要素から出るときの処理
 document.addEventListener("mouseout", async (e, undefined) =>{
    // アイコンである場合の処理
    let iconElement = document.getElementById(e.target.id);
    let icon = seekIcon(e.target);
    if(icon !== undefined){
        console.log(icon)
        if(icon == "edit"){
            const no = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
            if(document.getElementById("manHourEditForm" + no)){
                iconElement.setAttribute("src","/img/popup/edit/edit_disabled.png");
                return;
            }
        }
        iconElement.setAttribute("src", "/img/popup/" + icon + "/" + icon + ".png")
    }
 });