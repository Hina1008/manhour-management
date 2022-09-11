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
importScripts("js/background/enum/form.js");
importScripts("js/background/seekForm.js");
importScripts("js/background/enum/timeFormat.js");

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
		const keys = Object.keys(manHourInfo);
        for (let key of keys) {
            if(key != "currentManHourIndex"  && key != "localStorage" && key != "startTime") {
                console.log(key)
				manHourInfo[key]["formIndex"] = 1;
				await setLocalStorage(manHourInfo[key]["no"], manHourInfo[key]);
            }
        }
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

bg.getCurrentManHourInfo = async () => {
	console.log("call bg.getCurrentManHourInfo");
	Time();
	return new Promise(async(resolve) => {
		let storage = await getLocalStorage("currentManHourIndex");
		let index = storage["currentManHourIndex"];
		if(index !== undefined){
			let currentManHourInfo = await getLocalStorage(index);
			resolve(currentManHourInfo[index]);
		}
	})
}

/**
 * 
 * @param {*} no 
 * @param {string} time HH:mm:ss
 * @returns 
 */
bg.clickChangeTime = async (no, time) => {
	console.log("call bg.clickChangeTime");
	let storage = await getLocalStorage(no);
	let editTime = changeTimeFormater(time, "1000s");
	storage[no]["diffTime"] = 0;
	storage[no]["time"] = editTime;
	await setLocalStorage("startTime", new Date().getTime());
	await setLocalStorage(no, storage[no]);
}

/**
 * 現在、時間を測っている工数の No/Time/DiffTime を連想配列で取得
 * @returns 
 */
bg.getSelectManHour = async() =>{
	console.log("call bg.getSelectManHour");
	return new Promise(async(resolve) =>{
		let storage = await getLocalStorage("currentManHourIndex");
		let index = storage["currentManHourIndex"];
		let currentManHourInfo = await getLocalStorage(index);
		resolve(currentManHourInfo[index]);
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
bg.clickStartIcon = async(no) => {
	// 現在の時間を保存
	console.log("call bg.clickStartButton");

	await start(no);
};

/**
 * 停止アイコンを押した時の処理
 * @param {*} name 
 * @param {*} undefined 
 * @returns 
 */
bg.clickStopIcon = async(no, undefined) => {
	console.log("call bg.clickStopButton");
	return new Promise(async(resolve) =>{
		// 現在の時間を保存
		let storage = await getLocalStorage("currentManHourIndex");
		let index = storage["currentManHourIndex"]
		console.log(index);
		console.log(no);
		if(index == no){
			let manHourInfo = await getLocalStorage(index);
			stopCurrentManHour(manHourInfo, index);
			resolve(true);
			return;
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
bg.clickDeleteIcon = async(no, undefined) => {
	console.log("call clickDeleteButton");
	let storage = await getLocalStorage("currentManHourIndex");
	let index = storage["currentManHourIndex"];
	if(index == no){
		await removeLocalStorage("currentManHourIndex");
	}
	await removeLocalStorage(no);

	await removeContextMenus(no);
}

bg.clickSaveIcon = async (no, manHourName) =>{
	let storage = await getLocalStorage(no);
	storage[no]["name"] = manHourName;
	await setLocalStorage(no, storage[no]);
	await removeContextMenus(no);
	createContextMenus({
		"id": no.toString(),
		"title" : manHourName.replace("&","＆"),
		"parentId": "manhour-management",
		"type" : "normal",
		"contexts" : ["all"]
	});

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
			if(key == "currentManHourIndex"){
				await removeLocalStorage(key);
			}else if(key == "localStorage" || key == "startTime"){
				// nop
			}else{
				await setLocalStorage(key, {
					"name":manHourInfo[key]["name"],
					"time":0, 
					"no":manHourInfo[key]["no"], 
					"diffTime":0,
					"formIndex":manHourInfo[key]["formIndex"]
				});
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

bg.checkCurrentManHourInfo = async(no, undefined) => {
	console.log("call bg.checkCurrentForm");
	return new Promise(async(resolve) =>{
		let manHourInfo = await getLocalStorage(no);
		resolve(manHourInfo[no]);
	});
}

bg.subFormIndex = async (formIndex, arrow) => {
	console.log("call bg.subFormIndex");
	return new Promise(async(resolve) =>{
		if(arrow == "right"){
			if(checkForm(formIndex, "last")){
				let len = Object.keys(Form).length;
				resolve(-1 * (len-1));
			}else{
				resolve(1);
			}
		} else if(arrow == "left"){
			if(checkForm(formIndex, "start")){
				let len = Object.keys(Form).length;
				resolve(len-1)
			}else{
				resolve(-1);
			}
		}
		return ;
	});
}

bg.updateCurrentForm = async (no, arrow) => {
	console.log("call bg.updateCurrentForm");
	let manHourInfo = await getLocalStorage(no);
	let formIndex = manHourInfo[no]["formIndex"];
	if(arrow == "right"){
		if(checkForm(formIndex, "last")){
			formIndex = 1;
		}else{
			formIndex += 1;
		}
		// formIndex += 1;
	} else if(arrow == "left"){
		if(checkForm(formIndex, "start")){
			let keys = Object.keys(Form);
			formIndex = Form[keys[keys.length - 1]];
		}else{
			formIndex -= 1;
		}
		// formIndex -= 1;
	}
	manHourInfo[no]["formIndex"] = formIndex;
	setLocalStorage(no, manHourInfo[no]);
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
		let manHourNames = Object.entries(manHourInfo).map(
			([key,value]) => manHourInfo[key]["name"]
			).filter(Boolean)
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
		await setLocalStorage(storageNo, {
			"name": value,
			"time":0, 
			"no":storageNo, 
			"diffTime":0,
			"formIndex":1
		});
		await setLocalStorage("localStorage", storageNo + 1);
		createContextMenus({
			"id": storageNo.toString(),
			"title" : value.replace("&","＆"),
			"parentId": "manhour-management",
			"type" : "normal",
			"contexts" : ["all"]
		});
		console.log(storageNo);
		resolve(storageNo);
	});
};