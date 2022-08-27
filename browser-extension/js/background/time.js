/**
 * 時間に関する処理
 */
'use strict'
/**
 * 現在、経過時間を測っている工数
 * ⇨ ない ⇨ 終了
 * ⇨ ある ⇨ 開始時刻から現在時刻との差を　diffTimeに保存
 * @param {*} undefined 
 * @returns 
 */
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

let isEnableTimeValue = (time) => {
	if (time >=0 && time <60){
		return true;
	}
	return false;
}