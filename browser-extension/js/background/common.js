/**
 * ContextMenusとボタン,アイコンをクリックした際に共通する処理
 */
'use strict'
/**
 * 計測していた工数の 経過時間を更新して localStorageに保存する
 * ⇨ localStorageの "name"を削除 (現在の計測している工数を削除)
 * @param {*} manHourInfo 
 * @param {*} currentManHourName 
 */
 let stopCurrentManHour = async (manHourInfo, index) => {
	let startTime = await getLocalStorage("startTime");
	const diffTime = new Date().getTime() - startTime["startTime"];
	let time = manHourInfo[index]["time"] + diffTime;
	let no = manHourInfo[index]["no"];
	let name = manHourInfo[index]["name"]
	await setLocalStorage(index,{"name":name,"time":time,"no":no,"diffTime":0});
	await removeLocalStorage("currentManHourIndex");
}

/**
 * 現在計測している工数名を取得
 * ⇨ 工数名から、その工数の No/Time/DiffTime を取得
 *  ⇨ stopCurrentManHourを呼び出す
 * @param {} undefined 
 */
let stop = async (undefined) =>{
	// 現在の時間を保存
	let storage = await getLocalStorage("currentManHourIndex");
	let index = storage["currentManHourIndex"]
	if(index !== undefined){
		let manHourInfo = await getLocalStorage(index);
		stopCurrentManHour(manHourInfo, index);
	}
}

/**
 * 現在、計測している工数があれば、 経過時間を更新して localStorageに保存する
 * 引数で指定した、 工数名を localStorageの "name"にセット
 * このタイミングを 計測開始時刻として 以降時間を計測していく
 * @param {*} manHourName 
 * @param {*} undefined 
 */
let start = async (no, undefined) => {
	let storage = await getLocalStorage("currentManHourIndex");
	let index = storage["currentManHourIndex"];
	if(index !== undefined){
		let startTime = await getLocalStorage("startTime");
		let manHourInfo = await getLocalStorage(index);
		const diffTime = new Date().getTime() - startTime["startTime"];
		let time = manHourInfo[index]["time"] + diffTime;
		let cNo = manHourInfo[index]["no"];
		let name = manHourInfo[index]["name"];
		await setLocalStorage(index,{"name":name,"time":time,"no":cNo,"diffTime":0});
	}

	// 名前を変更
	await setLocalStorage("currentManHourIndex", no);
	await setLocalStorage("startTime", new Date().getTime());
	Time();
}