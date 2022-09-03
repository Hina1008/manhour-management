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
    let storage = await getLocalStorage("currentManHourIndex");
	let index = storage["currentManHourIndex"];
	if (storage["currentManHourIndex"] === undefined){
		return;
	}
	else{
		let currentManHour = await getLocalStorage(index);
		let startTime = await getLocalStorage("startTime");
		const name = currentManHour[index]["name"]
		const time = currentManHour[index]["time"];
		const no = currentManHour[index]["no"];
		const diffTime = new Date().getTime() - startTime["startTime"];
		const formIndex = currentManHour[index]["formIndex"];
		setLocalStorage(index,{"name":name, "time":time, "no":no, "diffTime": diffTime, "formIndex":formIndex})
		console.log("backgournd time:" + time + diffTime);
	}
}

let isEnableTimeValue = (time, upper) => {
	if (time >=0 && time < upper){
		return true;
	}
	return false;
}