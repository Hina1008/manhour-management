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
let createContextMenus = (properties) => {
	chrome.contextMenus.create(properties);
}

/**
 * 
 * @param {*} id 
 * @param {*} updateProperties 
 */
let updateContextMenus = (id,updateProperties) => {
	chrome.contextMenus.update(id,updateProperties);
}