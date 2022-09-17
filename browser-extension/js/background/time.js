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

let changeTimeFormater = (time, type) => {
	let value;
	if(type == TimeFormat["HH:mm:ss"]){
		let hour  = ("0" + (Math.trunc(time / (60 * 60 * 1000) % 24)|0)).slice(-2);
		let minutes  = ("0" +(Math.trunc(time / (60 * 1000) % 60)|0)).slice(-2);
		let seconds = ("0" + (Math.trunc(time / 1000 % 60)|0)).slice(-2);
		value = hour + ":" + minutes + ":" + seconds;
	}else if(type == TimeFormat["1000s"]){
		console.log(time)
		let list = time.split(":");
		let hour = list[0] * 60 * 60 * 1000;
		let minutes = list[1] * 60 * 1000;
		let seconds = list[2] * 1000;
		value = hour + minutes + seconds;
	}
	return value;
}

let checkEnabledTime = (time) => {
	if(time.split(":").length ==3){
		return true;
	}
	return false;
}