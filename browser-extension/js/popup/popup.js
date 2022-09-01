import {bg} from './backgroundCaller.js';
import {embeddingManHour, emmbeddingErrorMessage, deleteErrorMessage, openEditTimeForm, closeEditTimeForm} from'./embeddingHtml.js';
import {seekIcon} from './seekId.js'

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
    const no = e.target.parentNode.parentNode.parentNode.id;
    // アイコンである場合の処理
    if(e.target.className.includes("controller-icon")){
        let iconElement = document.getElementById(e.target.id);
        iconElement.style.position = 'relative';
        iconElement.style.top = "2px";
        setTimeout(() => {
            iconElement.style.top = "0px";
        }, 100);
        if(e.target.id == "start" + no){
            // 再生ボタンを押したときの処理
            let manHourName = document.getElementById("manHourName" + no).innerHTML;
            await bg.clickStartIcon(manHourName, no);

            intervalForMinute();
        }else if(e.targetid == "stop" + no){
            let isCurrentManHour = await bg.clickStopIcon(no);
            if(isCurrentManHour){
                // 停止ボタンを押したときの処理
                clearInterval(intervalForTimer);
            }
        }else if(e.target.id == "delete" + no){
            // 削除ボタンを押したときの処理
            let manHourName = document.getElementById("manHourName" + no).innerHTML;
            await bg.clickDeleteIcon(manHourName);
            let deleteManHourDiv = document.getElementById(no);
            deleteManHourDiv.remove();
        }else if(e.target.id == "arrow" + no){
            if(e.target.className.includes("up")){
                //nop
                closeEditTimeForm(no);
            }else if (e.target.className.includes("down")){
                let editIconElement = document.getElementById("edit" + no);
                editIconElement.setAttribute("src","/img/popup/edit/edit_disabled.png");
                openEditTimeForm(no);
            }
        }else if(e.target.id == "save" + no){
            let hour = document.getElementById("hour"+no).value
            let minute = document.getElementById("minute"+no).value
            let second = document.getElementById("second"+no).value

            // 入力された値が正しいかチェック 0 ~ 59の値
            bg.timeCheck(hour, minute, second).then(() => {
                let manHourName = document.getElementById("manHourName"+no).innerHTML
                // 時間を該当のlocalStorageに保存
                bg.updateTime(hour, minute, second, manHourName).then((time) => {
                    // popup画面を最新の値に変更
                    let manHourTime = document.getElementById("manHourTime"+no);
                    manHourTime.innerHTML = getTime(time);
                    let editFormErrorDiv = document.getElementById("edit-error-message"+ no);
                    if(editFormErrorDiv){
                        editFormErrorDiv.remove();
                    }
                })
            }).catch((e) => {
                const error = e["error"]
                let message;
                if(error.includes("Hours")){
                    message = "〇〇時には0~23の整数値のみ入力できます。"
                }else if(error.includes("Minutes")){
                    message = "〇〇分には0~59の整数値のみ入力できます。"
                }else if(error.includes("Seconds")){
                    message = "〇〇秒には0~59の整数値のみ入力できます。"
                }
                emmbeddingErrorMessage(message, "editFormErrorMessage" + no, "error", "edit-error-message" + no);
            })
        }
    }else if(e.target.id == "edit" + no && !document.getElementById("manHourEditForm" + no)){
        let editIconElement = document.getElementById(e.target.id);
        editIconElement.style.position = 'relative';
        editIconElement.style.top = "2px";
        setTimeout(() => {
            editIconElement.style.top = "0px";
        }, 100);
        editIconElement.setAttribute("src","/img/popup/edit/edit_disabled.png");
        openEditTimeForm(no);
    }else if(e.target.id == "manHourName" + no){
        let manHourName = e.target.innerHTML
        const parent = e.target.parentNode;
        e.target.remove();
        let child = document.createElement("input");
        child.setAttribute("value",manHourName);
        parent.appendChild(child);
    }
 });

 // マウスが要素上にあるときの処理
 document.addEventListener('mouseover', async (e, undefined) =>{
    // アイコンである場合の処理
    let iconElement = document.getElementById(e.target.id);
    let icon = seekIcon(e.target);
    if(icon !== undefined){
        console.log(icon)
        const no = e.target.parentNode.parentNode.parentNode.id;
        if(icon == "edit" && document.getElementById("manHourEditForm" + no)){
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
            const no = e.target.parentNode.parentNode.parentNode.id;
            if(document.getElementById("manHourEditForm" + no)){
                iconElement.setAttribute("src","/img/popup/edit/edit_disabled.png");
                return;
            }
        }
        iconElement.setAttribute("src", "/img/popup/" + icon + "/" + icon + ".png")
    }
 });