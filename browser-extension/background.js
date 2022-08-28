/**
 * フロント側から呼び出しがあった時の処理
 */
'use strict'
importScripts("js/background/backgroundListener.js");
importScripts("js/background/time.js");
importScripts("js/background/event.js");
importScripts("js/background/localStorage.js");
importScripts("js/background/contextMenus.js");
importScripts("js/background/notification.js");
importScripts("js/background/common.js");

/**
 * ポップアップ画面が開かれたときに呼び出される処理
 * @returns 
 */
bg.pageCallUpdateInfo = async() => {
	console.log("call bg.pageCallUpdateInfo");
	return new Promise(async (resolve) => {
		console.log("call pageCallUpdateInfo");
		await Time();
		let manHourInfo = await getLocalStorage();
		console.log(manHourInfo);
		resolve(manHourInfo);
	});
};

/**
 * デスクトップ通知を行う時に呼び出される処理
 * @param {*} title 
 * @param {*} description 
 */
bg.notification = async(title, description) => {
	console.log("call bg.notification");
	notification(title, description);
};

/**
 * 引数に指定された工数の、 No/Time/DiffTime を連想配列で取得
 * @param {*} name 
 * @returns 
 */
bg.getManHourInfo = async (name) => {
	console.log("call bg.getManHourInfo");
	Time();
	return new Promise(async(resolve) =>{
		let manHourInfo = await getLocalStorage(name);
		if(manHourInfo[name]){
			console.log("no:" + manHourInfo[name]["no"] + ",time:" + manHourInfo[name]["time"])
			resolve(manHourInfo[name]);
		}
	})
};

/**
 * 現在、時間を測っている工数の No/Time/DiffTime を連想配列で取得
 * @returns 
 */
bg.getSelectManHour = async() =>{
	console.log("call bg.getSelectManHour");
	return new Promise(async(resolve) =>{
		let selectManHour = await getLocalStorage("name");
		resolve(selectManHour["name"]);
	})
}

/**
 * ブラウザ拡張のオプションで設定した値を取得
 * @param {*} key 
 * @returns 
 */
bg.getOptionValue = async (key) => {
	console.log("call bg.getOptionValue");
	return new Promise(async(resolve) => {
		resolve(false);
	})
}

/**
 * popupでの値を表示する
 * @param {} message 
 * @returns 
 */
bg.Mock = async(message) => {
	console.log("----------------------------");
	console.log("message:" + message);
	console.log("----------------------------");
	return new Promise(resolve => {
		resolve();
	})
}

/**
 * 再生アイコンを押した時の処理
 * @param {*} manHourName 
 */
bg.clickStartIcon = async(manHourName) => {
	// 現在の時間を保存
	console.log("call bg.clickStartButton");
	console.log(manHourName.replace("&amp;","&"));

	await start(manHourName.replace("&amp;","&"));
};

/**
 * 停止アイコンを押した時の処理
 * @param {*} name 
 * @param {*} undefined 
 * @returns 
 */
bg.clickStopIcon = async(name, undefined) => {
	console.log("call bg.clickStopButton");
	return new Promise(async(resolve) =>{
		// 現在の時間を保存
		let currentManHour = await getLocalStorage("name");
		if(currentManHour["name"] !== undefined){
			let manHourInfo = await getLocalStorage(currentManHour["name"]);
			if(name.replace("&amp;","&") == manHourInfo[currentManHour["name"]]["no"]){
				stopCurrentManHour(manHourInfo, currentManHour["name"]);
				resolve(true);
				return;
			}
		}else{
			console.log("is empty");
		}
		resolve(false);
	});
};

/**
 * 削除アイコンを押した時の処理
 * @param {*} name 
 * @param {*} undefined 
 */
bg.clickDeleteIcon = async(name, undefined) => {
	console.log("call clickDeleteButton");
	let currentManHour = await getLocalStorage("name");
	if(currentManHour["name"] == name.replace("&amp;","&")){
		await removeLocalStorage("name");
	}
	await removeLocalStorage(name.replace("&amp;","&"));

	await removeContextMenus(name.replace("&amp;","&"));
}

/**
 * 保存アイコンを押した時の処理
 * 入力された時間が、正しい値かをチェック
 * @param {*} hour 
 * @param {*} minute 
 * @param {*} second 
 * @returns 
 */
bg.timeCheck = async(hour, minutes, seconds) => {
	return new Promise((resolve, reject) => {
		const isEnable = isEnableTimeValue(hour) 
						&& isEnableTimeValue(minutes) 
						&& isEnableTimeValue(seconds);
		if(!isEnable){
			reject("Invalid input value. You can enter values from 0 to 59.");
			return;
		}
		resolve();
	})
}

/**
 * 保存アイコンをクリックして、bg.timeCheckが通った時に行われる処理
 * 入力された時間を localStorageに保存
 * 現在、経過時間を測っている工数だった場合, 開始時刻を現在時刻に設定
 * @param {*} hour 
 * @param {*} minute 
 * @param {*} second 
 * @param {*} name 
 * @returns 
 */
bg.updateTime = async (hour, minute, second, name) =>{
	return new Promise(async (resolve, reject) => {
		let time = hour*1000*60*60 + minute*1000*60 + second*1000;
		let manHourName = name.replace("&amp;","&")
		let manHourInfo = await getLocalStorage(manHourName);
		let no = manHourInfo[manHourName]["no"]
		setLocalStorage(manHourName,{"no":no,"time":time,"diffTime":0});
		let currentManHourName = await getLocalStorage("name");
		if (manHourName == currentManHourName["name"]){
			setLocalStorage("startTime",new Date().getTime())
		}
		resolve(time);
	})
}

/**
 * リセットボタンを押した時の処理
 * @param {} undefined 
 * @returns 
 */
bg.clickResetButton = async(undefined) => {
	console.log("call bg.clickResetButton");
	return new Promise(async(resolve) =>{
		let manHourInfo = await getLocalStorage();
		const keys = Object.keys(manHourInfo);
		for (let key of keys){
			if(key == "name"){
				await removeLocalStorage(key);
			}else if(key == "localStorage" || key == "startTime"){
				// nop
			}else{
				await setLocalStorage(key, {"time":0, "no":manHourInfo[key]["no"], "diffTime":0});
			}
		}
		resolve(await getLocalStorage());
	});
};

/**
 * 全て停止ボタンを押した時の処理
 * @param {*} undefined 
 */
bg.clickAllStopButton = async(undefined) => {
	console.log("call bg.clickAllStopButton");
	// 現在の時間を保存
	await stop();
}

/**
 * 工数を追加するボタンを押した時の処理
 * @param {*} value 
 * @param {*} undefined 
 * @returns 
 */
bg.clickAddButton = async(value, undefined) => {
	console.log("call clickAddButton");
	return new Promise(async (resolve, reject) => {
		let storage = await getLocalStorage("localStorage");
		if (storage["localStorage"] === undefined){
			await setLocalStorage("localStorage", 1);
			storage = await getLocalStorage("localStorage");
		}

		// 同じ工数名が入力された場合、拒否する
		let manHourInfo = await getLocalStorage();
		const manHourNames = Object.keys(manHourInfo);
		if (manHourNames.includes(value)){
			reject("duplication");
			return;
		}else if(value.includes("＆")){
			reject("forbidden word");
			return;
		}else if(value ===""){
			reject("empty");
			return;
		}
		let storageNo = storage["localStorage"];
		await setLocalStorage(value, {"time":0, "no":storageNo, "diffTime":0});
		await setLocalStorage("localStorage", storageNo + 1);
		createContextMenus(value);
		console.log(storageNo);
		resolve(storageNo);
	});
};