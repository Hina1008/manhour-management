'use strict'
importScripts("js/backgroundListener.js");

const setLocalStorage = (name, value) => new Promise ((resolve, reject) => {
	let jsonFile = {};
	jsonFile[name] = value;
	chrome.storage.local.set(jsonFile, ()=>{
		console.log("storageNum:"+storageNum + ":name:" + name);
		resolve(true);
	});
});

const getLocalStorage = (key = null) => new Promise(resolve => {
	chrome.storage.local.get(key, (data) => {resolve(data)});
  });

const removeLocalStorage = (key) => new Promise((resolve, reject) => {
	chrome.storage.local.remove(key, () =>{
		console.log("delete:"+key);
		resolve(true);
	})
});

let createContextMenus = (title) => {
	chrome.contextMenus.create({
		"title" : title,
		"id": title,
		"type" : "normal",
		"contexts" : ["all"],
		"onclick" : getClickHandler()
	});
}

let removeContextMenus = (id) => {
	console.log("call removeContextMenus");
	console.log("id:" + id);
	return new Promise((resolve, reject) => {
		chrome.contextMenus.remove(id, () => {
			if (chrome.runtime.lastError) {
				console.log("error removing item:", chrome.runtime.lastError)
				reject(err);
			} else {
				console.log(id + " removed successfully")
				resolve();
			}
		});
	});
};

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "some-command") {
        console.log("yay!");
    }
});

let notification = async(title, description) => {
	try {
		chrome.notifications.create({
			type:     'basic',
			iconUrl:  '/img/icon_128.png',
			title:    title,
			message:  description
		});	
		return true;
	} catch (error) {
		return false;
	}
}

bg.pageCallUpdateInfo = async() => {
	return new Promise(async (resolve) => {
		console.log("call pageCallUpdateInfo");
		let manHourInfo = await getLocalStorage();
		console.log(manHourInfo);
		resolve(manHourInfo);
	});
};

bg.clickResetButton = async() => {
	console.log("call clickResetButton");
	clearInterval(intervalForTimer);
	count = 0;
	currentNo = null;
	let manHourInfo = await getLocalStorage();
	const keys = Object.keys(manHourInfo);
	for (let key of keys){
		if(key == "name"){
			await setLocalStorage(key, null);
		}else{
			await setLocalStorage(key, {"time":0, "no":manHourInfo[key]["no"]});
		}
	}
};

bg.clickStartButton = async(manHourName, no) => {
	// 現在の時間を保存
	console.log("call clickStartButton");
	console.log(manHourName);
	console.log(no);
	if(currentNo){
		let currentManHour = await getLocalStorage("name");
		await setLocalStorage(currentManHour["name"],{"time":count,"no":currentNo})
	}

	// 名前を変更
	await setLocalStorage("name", manHourName);
	let manHourInfo = await getLocalStorage(manHourName);
	count = manHourInfo[manHourName]["time"];
	currentNo = manHourInfo[manHourName]["no"];
	clearInterval(intervalForTimer);
	intervalForTimer = setInterval(Time, 1000);
};

bg.clickStopButton = async() => {
	console.log("call clickStopButton");
	clearInterval(intervalForTimer);
	if(currentNo){
		let currentManHour = await getLocalStorage("name");
		setLocalStorage(currentManHour["name"],{"time":count,"no":currentNo})
	}
	count = 0;
	currentNo = null;
};

bg.clickDeleteButton = async(name) => {
	console.log("call clickDeleteButton");
	let currentManHour = await getLocalStorage("name");
	if(currentManHour["name"] == name){
		clearInterval(intervalForTimer);
		count = 0;
		currentNo = null;
	}
	await removeLocalStorage(name);
	await removeContextMenus(name);
}

bg.clickAddButton = async(value) => {
	// 現在の時間を保存
	console.log(value);
	if(currentNo){
		let currentManHour = await getLocalStorage("name");
		setLocalStorage(currentManHour["name"],{"time":count,"no":currentNo})
	}

	// 名前を変更
	await setLocalStorage("name", value);
	return new Promise(async (resolve, reject) => {
		let canSet = await setLocalStorage(value, {"time":0, "no":storageNum});
		if(canSet){
			count = 0;
			currentNo = storageNum;
			createContextMenus(value);
			resolve(storageNum);
			storageNum+=1;
		}else{
			reject(false);
		}
	});
};

bg.notification = async(title, description) => {
	return new Promise((resolve, reject) => {
		let canNotify = notification(title, description);
		if(canNotify){
			resolve(true);
		}else{
			reject(false);
		}
	});
};

/**
 * 右クリックで押されたとき
 */
let getClickHandler = () => {
};

bg.countTime = async() => {
	return new Promise(async(resolve) => {
		let time = await getLocalStorage("time");
		console.log("time:" + time["time"]["time"]);
		resolve(getTime(time["time"]["time"]));	
	})
};

bg.getManHourInfo = async (name) => {
	return new Promise(async(resolve, reject) =>{
		let manHourInfo = await getLocalStorage(name);
		if(manHourInfo[name]){
			console.log("no:" + manHourInfo[name]["no"] + ",time:" + manHourInfo["time"])
			resolve(manHourInfo[name]["no"]);
		}else{
			console.log("reject");
			reject(0)
		}
	})
};

bg.getSelectManHour = async() =>{
	return new Promise(async(resolve) =>{
		let selectManHour = await getLocalStorage("name");
		resolve(selectManHour["name"]);
	})
}

bg.Mock = async(message) => {
	console.log("----------------------------");
	console.log("message:" + message);
	console.log("----------------------------");
	return new Promise(resolve => {
		resolve();
	})
}

let getTime =(time) => {
	let hour  = ("0" + Math.trunc(time / (60 * 60 * 1000) % 24)).slice(-2);
	let minutes  = ("0" + Math.trunc(time / (60 * 1000) % 60)).slice(-2);
	let seconds = ("0" + Math.trunc(time / 1000 % 60)).slice(-2);
	let text = hour + ":" + minutes + ":" + seconds;
	return text;
};

let Time = async () =>{
    count += 1000;
	setLocalStorage("time", {"time":count, "no":0});
	if(currentNo){
		let currentManHour = await getLocalStorage("name");
		setLocalStorage(currentManHour["name"],{"time":count,"no":currentNo})
	}
	console.log(count);
}

chrome.runtime.onInstalled.addListener(detail => {
	if (detail.reason == "install" || detail.reason == "update") {
		createContextMenus("工数管理");
		chrome.storage.local.clear()
	}
});

let count = 0;
let storageNum = 2;
let currentNo;
let intervalForTimer = setInterval(Time, 1000);