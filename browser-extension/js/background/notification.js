/**
 * デスクトップ通知に関する処理
 */
'use strict';
/**
 * z
 * @param {*} title 
 * @param {*} description 
 */
let notification = (title, description) => {
	chrome.notifications.create({
		type:     'basic',
		iconUrl:  '/img/icon_128.png',
		title:    title,
		message:  description
	});	
}