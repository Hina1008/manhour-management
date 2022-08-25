'use strict'
importScripts("js/backgroundListener.js");

const setLocalStorage = (name, value) => new Promise ((resolve, reject) => {
	let jsonFile = {};
	jsonFile[name] = value;
	chrome.storage.local.set(jsonFile, ()=>{
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
		"title" : title.replace("&","＆"),
		"id": title,
		"parentId": "manhour-management",
		"type" : "normal",
		"contexts" : ["all"]
	});
}

chrome.contextMenus.onClicked.addListener((info) => {
	switch (info.menuItemId) {
		case "stop":
			// stop処理
			console.log("call contextMenus stop")
			stop();
			return;
		case "manhour-management":
			console.log("call contextMenus manhour-management");
			return ;
		default:
			// 工数名を押した時の処理
			console.log("call contextMenus " + info.menuItemId)
			start(info.menuItemId);
			return;
	}
});

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

let notification = (title, description) => {
	chrome.notifications.create({
		type:     'basic',
		iconUrl:  '/img/icon_128.png',
		title:    title,
		message:  description
	});	
}

let stop = async (undefined) =>{
	// 現在の時間を保存
	let currentManHour = await getLocalStorage("name");
	if(currentManHour["name"] !== undefined){
		let manHourInfo = await getLocalStorage(currentManHour["name"]);
		stopCurrentManHour(manHourInfo, currentManHour["name"]);
	}
}

let start = async (manHourName, undefined) => {
	let currentManHour = await getLocalStorage("name");
	if(currentManHour["name"] !== undefined){
		let manHourInfo = await getLocalStorage(currentManHour["name"]);
		let time = manHourInfo[currentManHour["name"]]["time"] + manHourInfo[currentManHour["name"]]["diffTime"];
		let cNo = manHourInfo[currentManHour["name"]]["no"];
		await setLocalStorage(currentManHour["name"],{"time":time,"no":cNo,"diffTime":0});
	}

	// 名前を変更
	await setLocalStorage("name", manHourName);
	await setLocalStorage("startTime", new Date().getTime());
	// clearInterval(intervalForTimer);
	chrome.alarms.clear("Time")
	Time();
}

let stopCurrentManHour = async (manHourInfo, currentManHourName) => {
	let time = manHourInfo[currentManHourName]["time"] + manHourInfo[currentManHourName]["diffTime"];
	let no = manHourInfo[currentManHourName]["no"];
	await setLocalStorage(currentManHourName,{"time":time,"no":no,"diffTime":0});
	await removeLocalStorage("name");
}

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

bg.clickAllStopButton = async(undefined) => {
	console.log("call bg.clickAllStopButton");
	// 現在の時間を保存
	await stop();
}

bg.clickStartButton = async(manHourName) => {
	// 現在の時間を保存
	console.log("call bg.clickStartButton");
	console.log(manHourName.replace("&amp;","&"));

	await start(manHourName.replace("&amp;","&"));
};

bg.clickStopButton = async(name, undefined) => {
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

bg.clickDeleteButton = async(name, undefined) => {
	console.log("call clickDeleteButton");
	let currentManHour = await getLocalStorage("name");
	if(currentManHour["name"] == name.replace("&amp;","&")){
		await removeLocalStorage("name");
	}
	await removeLocalStorage(name.replace("&amp;","&"));

	await removeContextMenus(name.replace("&amp;","&"));
}

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
		}
		let storageNo = storage["localStorage"];
		await setLocalStorage(value, {"time":0, "no":storageNo, "diffTime":0});
		await setLocalStorage("localStorage", storageNo + 1);
		createContextMenus(value);
		console.log(storageNo);
		resolve(storageNo);
	});
};

bg.notification = async(title, description) => {
	console.log("call bg.notification");
	notification(title, description);
};

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

bg.getSelectManHour = async() =>{
	console.log("call bg.getSelectManHour");
	return new Promise(async(resolve) =>{
		let selectManHour = await getLocalStorage("name");
		resolve(selectManHour["name"]);
	})
}

bg.getOptionValue = async (key) => {
	console.log("call bg.getOptionValue");
	return new Promise(async(resolve) => {
		resolve(false);
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

let Time = async (undefined) =>{
    let storage = await getLocalStorage("name");
	if (storage["name"] === undefined){
		return;
	}
	else{
		let currentManHour = await getLocalStorage(storage["name"]);
		let startTime = await getLocalStorage("startTime");
		const time = currentManHour[storage["name"]]["time"];
		const no = currentManHour[storage["name"]]["no"];
		const diffTime = new Date().getTime() - startTime["startTime"];
		setLocalStorage(storage["name"],{"time":time, "no":no, "diffTime": diffTime})
		console.log("backgournd time:" + time + diffTime);
	}
}

let initContextMenus = (title, id) => {
	chrome.contextMenus.create({
		"title" : title,
		"id": id,
		"type" : "normal",
		"contexts" : ["all"]
	});
}

chrome.runtime.onInstalled.addListener(detail => {
	if (detail.reason == "install" || detail.reason == "update") {
		initContextMenus("工数","manhour-management");
		initContextMenus("停止","stop");
		chrome.storage.local.clear();
	}
});