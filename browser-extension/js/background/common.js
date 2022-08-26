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
 let stopCurrentManHour = async (manHourInfo, currentManHourName) => {
	let startTime = await getLocalStorage("startTime");
	const diffTime = new Date().getTime() - startTime["startTime"];
	let time = manHourInfo[currentManHourName]["time"] + diffTime;
	let no = manHourInfo[currentManHourName]["no"];
	await setLocalStorage(currentManHourName,{"time":time,"no":no,"diffTime":0});
	await removeLocalStorage("name");
}

/**
 * 現在計測している工数名を取得
 * ⇨ 工数名から、その工数の No/Time/DiffTime を取得
 *  ⇨ stopCurrentManHourを呼び出す
 * @param {} undefined 
 */
let stop = async (undefined) =>{
	// 現在の時間を保存
	let currentManHour = await getLocalStorage("name");
	if(currentManHour["name"] !== undefined){
		let manHourInfo = await getLocalStorage(currentManHour["name"]);
		stopCurrentManHour(manHourInfo, currentManHour["name"]);
	}
}

/**
 * 現在、計測している工数があれば、 経過時間を更新して localStorageに保存する
 * 引数で指定した、 工数名を localStorageの "name"にセット
 * このタイミングを 計測開始時刻として 以降時間を計測していく
 * @param {*} manHourName 
 * @param {*} undefined 
 */
let start = async (manHourName, undefined) => {
	let currentManHour = await getLocalStorage("name");
	if(currentManHour["name"] !== undefined){
		let startTime = await getLocalStorage("startTime");
		let manHourInfo = await getLocalStorage(currentManHour["name"]);
		const diffTime = new Date().getTime() - startTime["startTime"];
		let time = manHourInfo[currentManHour["name"]]["time"] + diffTime;
		let cNo = manHourInfo[currentManHour["name"]]["no"];
		await setLocalStorage(currentManHour["name"],{"time":time,"no":cNo,"diffTime":0});
	}

	// 名前を変更
	await setLocalStorage("name", manHourName);
	await setLocalStorage("startTime", new Date().getTime());
	Time();
}