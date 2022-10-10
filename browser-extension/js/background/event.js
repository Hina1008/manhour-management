/**
 * イベントが起こった時に、発火する処理
 */
'use strict'
/**
 * ブラウザ拡張が呼び出された or アップデートされた時に発火
 * 工数を表示する ContextMenusを作成
 * 押したら、計測している工数が止まる ContextMenusを作成
 * localStorageのデータを削除
 */
chrome.runtime.onInstalled.addListener(async(detail) => {
	if (detail.reason == "install" || detail.reason == "update") {
		createContextMenus({
			"id": "manhour-management",
			"title" : "工数",
			"type" : "normal",
			"contexts" : ["all"]
		});
		createContextMenus({
			"id": "stop",
			"title" : "停止",
			"type" : "normal",
			"contexts" : ["all"]
		});
		getAllManHourInfo().then((manHourInfo) => {
			const keys = Object.keys(manHourInfo);
			for (let key of keys) {
				createContextMenus({
					"id": key,
					"title" : manHourInfo[key]["name"],
					"parentId": "manhour-management",
					"type" : "normal",
					"contexts" : ["all"]
				});
			}
		})
	}
});

/**
 * ContextMenusが押された時の処理
 * stop(停止) ⇨ 計測している工数を止める
 * manhour-management(工数) ⇨ 何も起こらない
 * それ以外(工数名) ⇨ 選択した工数の時間の計測開始
 */
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