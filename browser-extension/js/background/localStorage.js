/**
 * localStorage APIを使う処理
 */
'use strict';
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

const getAllManHourInfo = () => new Promise((resolve) => {
	chrome.storage.local.get(null, (data) => {
		const keys = Object.keys(data);
		for (let key of keys) {
			// 数字か否かの判定 (工数のkeyは数字であるため)
            if(isNaN(key)) {
                // 工数情報以外のデータを削除
                delete data[key];
            }
		}
		resolve(data);
	})
});

const getTotalTime = () => new Promise((resolve, reject) => {
	chrome.storage.local.get(null, (data) => {
		let totalTime = 0;
		const keys = Object.keys(data);
		for (let key of keys) {
            if(key != "currentManHourIndex" && key != "time" && key != "localStorage" && key != "startTime") {
                // 各工数の時間を更新する
                // 合計時間を加算する
                totalTime += data[key]["time"]+data[key]["diffTime"]
            }
		}
		resolve(totalTime);
	})
})