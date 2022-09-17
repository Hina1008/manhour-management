import {bg} from './backgroundCaller.js';
import {embeddingManHour, emmbeddingErrorMessage, removeErrorMessage, deleteErrorMessage, embeddingAlertMessage} from'./embeddingHtml.js';
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

let clickIcon = (id) => {
    let iconElement = document.getElementById(id);
        iconElement.style.position = 'relative';
        iconElement.style.top = "2px";
        setTimeout(() => {
            iconElement.style.top = "0px";
        }, 100);
}


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
            embeddingAlertMessage("工数が追加されました。", "info");

        }).catch(async (error) => {
            let message;
            console.log(error["error"]);
            if(error["error"] == "forbidden word"){
                message = "全角「＆」 は使用できません。"
            }else if(error["error"] == "empty"){
                message = "工数名が空です。 工数名を入力してください。"
            } 
            emmbeddingErrorMessage(message, "errorMessage", "error", "error-content");
            embeddingAlertMessage(message, "error");
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
        clickIcon(e.target.id);
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
            if(ul.lastElementChild == e.target.parentNode.parentNode.parentNode){
                ul.appendChild(ul.firstElementChild);
            }
            let manHourInfo = await bg.getManHourInfo(no);
            let time = getTime(manHourInfo["time"] + manHourInfo["diffTime"]);
            let homeTime = document.getElementById("manHourTime" + no + "-1");
            let editTime = document.getElementById("manHourTime" + no + "-2");
            let homeManHourName = document.getElementById("manHourName" + no + "-1");
            homeTime.innerHTML = time;
            editTime.innerHTML = time;
            homeManHourName.innerHTML = manHourInfo["name"];
            deleteErrorMessage(
                document.getElementById("message" + no)
            );
            ul.scrollLeft += ul.clientWidth;
        }else if(e.target.id == "left" + no + "-" + formIndex){
            // 左矢印を押した時の処理
            await bg.updateCurrentForm(no, "left");
            let ul = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('ul');
            if(ul.firstElementChild == e.target.parentNode.parentNode.parentNode){
                ul.prepend(ul.lastElementChild);
            }
            let time = getTime(manHourInfo["time"] + manHourInfo["diffTime"]);
            let homeTime = document.getElementById("manHourTime" + no + "-1");
            let editTime = document.getElementById("manHourTime" + no + "-2");
            let homeManHourName = document.getElementById("manHourName" + no + "-1");
            homeTime.innerHTML = time;
            editTime.innerHTML = time;
            deleteErrorMessage(
                document.getElementById("message" + no)
            );
            homeManHourName.innerHTML = manHourInfo["name"];

            ul.scrollLeft -= ul.clientWidth;
        }else if(e.target.id == "change" + no + "-" + formIndex){
            // 時間を変更するためのアイコンを押した時の処理
            let time = document.getElementById("inputTime" + no + "-" + formIndex);
            console.log(time.value)
            bg.isEnabledTime(time.value).then(async (result) =>{
                await bg.updateTime(no, time.value);
                // await bg.Mock(time.value);
                document.getElementById("manHourTime" + no + "-2").innerHTML = time.value;
            }).catch((result) => {
                emmbeddingErrorMessage("時間の入力値が不正です。", "message"+no, "edit-error", "errorContent" + no, no);
            })
        }
    }else if(e.target.className.includes("delete-error-message-icon")){
        const no = e.target.parentNode.parentNode.parentNode.id;
        const manHourInfo = await bg.checkCurrentManHourInfo(no);
        const formIndex = manHourInfo["formIndex"];
        clickIcon(e.target.id);
        if(e.target.id == "close" + no){
            // 閉じるボタンを押したときの処理
            deleteErrorMessage(
                document.getElementById("message" + no)
            );
        }
    }else if(e.target.className.includes("delete-add-error-message-icon")){
        clickIcon(e.target.id);
        if(e.target.id == "close"){
            // 閉じるボタンを押したときの処理
            deleteErrorMessage(
                document.getElementById("errorMessage")
            );
        }
    }
 });

 let root = document.getElementById("root");
 root.addEventListener('keypress',  async (e, undefined) =>{
    if (e.key === "Enter") {
        if(e.target.className == "input-manhour-name"){
            const no = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
            const manHourInfo = await bg.checkCurrentManHourInfo(no);
            const formIndex = manHourInfo["formIndex"];
            let manHourName = document.getElementById("manHourName" + no + "-" + formIndex).value;
            if(manHourName.includes("＆")){
                emmbeddingErrorMessage("全角＆は設定できません。", "message"+no, "edit-error", "errorContent" + no, no);
                embeddingAlertMessage("全角＆は設定できません。", "error");
            }else if(!manHourName){
                emmbeddingErrorMessage("空白は設定できません。", "message"+no, "edit-error", "errorContent" + no, no);
                embeddingAlertMessage("空白は設定できません。", "error");
            }else{
                await bg.clickSaveIcon(no, manHourName);
                embeddingAlertMessage("工数名が変更されました。", "info");
            }
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


//スクロールすると上部に固定させるための設定を関数でまとめる
function FixedAnime() {
	var scroll = window.scrollY;
	if (scroll >= 15){//headerの高さ以上になったら
			//fixedというクラス名を付与
            document.getElementById("fixedHeader").classList.add("fixed")
		}else{
			//fixedというクラス名を除去
            document.getElementById("fixedHeader").classList.remove("fixed")
		}
}

// 画面をスクロールをしたら動かしたい場合の記述
window.onscroll = () =>{
    FixedAnime();
  };

// ページが読み込まれたらすぐに動かしたい場合の記述
window.onload = () => {
	FixedAnime();/* スクロール途中からヘッダーを出現させる関数を呼ぶ*/
};