/**
 * ContextMenusに関する処理
 */
'use strict';
/**
 * 引数で指定した IDに一致する ContextMenusを削除する
 * ポップアップ画面で,削除アイコンを押した 工数が ContextMenusから削除される
 * @param {*} id 
 * @returns 
 */
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

/**
 * 引数名を titleとidとした ContextMenusを作成する
 * ポップアップ画面で,追加ボタンを押した際に、入力されている工数名がそのまま引数の値になる
 * @param {*} title 
 */
let createContextMenus = (id, title) => {
	chrome.contextMenus.create({
		"id": id,
		"title" : title.replace("&","＆"),
		"parentId": "manhour-management",
		"type" : "normal",
		"contexts" : ["all"]
	});
}

/**
 * 引数の title idを それぞれの title id としたContextMenusを作成する
 * ブラウザ拡張がインストール or 更新された時に 
 * 　　　　　　　　　　　　工数 と 停止のContextMenusがそれぞれ作成される
 * @param {*} title 
 * @param {*} id 
 */
let initContextMenus = (title, id) => {
	chrome.contextMenus.create({
		"title" : title,
		"id": id,
		"type" : "normal",
		"contexts" : ["all"]
	});
}