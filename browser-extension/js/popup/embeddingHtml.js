let embeddingDiv = (idName, className, childElement, parentElement) => {
    childElement.setAttribute("id",idName);
    childElement.setAttribute("class",className);
    parentElement.appendChild(childElement);
}

let embeddingIcons = (src, idName, className, no, childElement, parentElement) => {
    childElement.setAttribute("src",src);
    childElement.setAttribute("id",idName);
    childElement.setAttribute("class",className);
    childElement.setAttribute("name",no);
    parentElement.appendChild(childElement);
}

let embeddingLine = (className, parentElement) => {
    // 線を追加
    let lineElement = document.createElement("hr")
    lineElement.setAttribute("class",className);
    parentElement.appendChild(lineElement);
};

export let embeddingManHour = (name, no, time, rootDiv) =>{
    // 工数名ごとにDivを追加する
    let manHourDiv = document.createElement("div"); // div要素作成
    embeddingDiv("manHour" + no,
            "manHour-frame",
            manHourDiv,
            rootDiv);

    // 工数に関する情報を持つDivを追加する
    let manHourFormDiv = document.createElement("div"); // div要素作成
    embeddingDiv("manHourForm" + no,
            "manHour-frame",
            manHourFormDiv,
            manHourDiv);

    // 工数名を追加する
    let manHourParagraph = document.createElement("p"); // p要素作成
    let manHourText = document.createTextNode(name); // テキストノードを作成
    manHourParagraph.appendChild(manHourText); // p要素にテキストノードを追加
            embeddingDiv("manHourParagraph" + no,
            "manHour-paragraph",
            manHourParagraph,
            manHourFormDiv);

    // アイコンと時間用のDivを追加する
    let manHourControllerDiv = document.createElement("div"); // div要素作成
    embeddingDiv("manHourController" + no,
            "manHour-controller",
            manHourControllerDiv,
            manHourFormDiv);

    // 削除アイコンの追加
    let deleteImg = document.createElement("img"); // img要素作成
    embeddingIcons("/img/popup/delete/delete.png",
            "delete" + no,
            "controller-icon delete",
                no,
            deleteImg,
            manHourControllerDiv);

    // 再生アイコンの追加
    let startImg = document.createElement("img"); // img要素作成
    embeddingIcons("/img/popup/start/start.png",
            "start" + no,
            "controller-icon start",
                no,
            startImg,
            manHourControllerDiv);

    // 停止アイコンの追加
    let stopImg = document.createElement("img"); // img要素作成
    embeddingIcons("/img/popup/stop/stop.png",
            "stop" + no,
            "controller-icon stop",
                no,
            stopImg,
            manHourControllerDiv);
    
    // 工数時間の追加
    let manHourTimeParagraph = document.createElement("p"); // p要素作成
    let manHourTimeText = document.createTextNode(time); // テキストノードを作成
    manHourTimeParagraph.appendChild(manHourTimeText); // p要素にテキストノードを追加
    embeddingDiv("manHourTime" + no,
            "time",
            manHourTimeParagraph,
            manHourControllerDiv);

    // 編集アイコンの追加
    let editImg = document.createElement("img"); // img要素作成
    embeddingIcons("/img/popup/edit/edit.png",
            "edit" + no,
            "controller-icon edit",
                no,
            editImg,
            manHourControllerDiv);

    // 線を追加
    embeddingLine("hr3", manHourDiv);
}


export let deleteErrorMessage = (parent) =>{
    // エラーメッセージが既に表示されていたら削除する
    while(parent.lastChild){
        parent.removeChild(parent.lastChild);
    }
}

export let emmbeddingErrorMessage = (message, className) => {
    let divElement = document.getElementById("error-message");

    // エラーメッセージが既に表示されていたら削除する
    deleteErrorMessage(divElement);

    let pElement = document.createElement("p"); // p要素作成
    let errorMessage = document.createTextNode(message); // テキストノードを作成
    pElement.appendChild(errorMessage); // p要素にテキストノードを追加
    pElement.setAttribute("class", className);
    divElement.appendChild(pElement);
}

export let embeddingEditTimeForm = (no) =>{
    console.log("no:" + no);
    let manHourFormDiv = document.getElementById("manHourForm"+ no);

    // 編集用のDivを追加する
    let manHourEditFormDiv = document.createElement("div"); // div要素作成
    embeddingDiv("manHourEditForm" + no,
            "manHour-edit-form",
            manHourEditFormDiv,
            manHourFormDiv);

    let hourInput = document.createElement("input"); // 時用　input要素作成
    let minuteInput = document.createElement("input"); // 分用　input要素作成
    let secondInput = document.createElement("input"); // 秒用　input要素作成
    
    let colon1 = document.createTextNode(":"); // テキストノードを作成
    let colon2 = document.createTextNode(":"); // テキストノードを作成
    let separateP1 = document.createElement("p");
    separateP1.setAttribute("class","colon");
    separateP1.appendChild(colon1);
    let separateP2 = document.createElement("p");
    separateP2.setAttribute("class","colon");
    separateP2.appendChild(colon2);

    hourInput.setAttribute("id","hour" + no);
    hourInput.setAttribute("class","time-edit");
    hourInput.setAttribute("name",no);

    minuteInput.setAttribute("id","minute" + no);
    minuteInput.setAttribute("class","time-edit");
    minuteInput.setAttribute("name",no);

    secondInput.setAttribute("id","minute" + no);
    secondInput.setAttribute("class","time-edit");
    secondInput.setAttribute("name",no);
    
    manHourEditFormDiv.appendChild(hourInput);
    manHourEditFormDiv.appendChild(separateP1);
    manHourEditFormDiv.appendChild(minuteInput);
    manHourEditFormDiv.appendChild(separateP2);
    manHourEditFormDiv.appendChild(secondInput);
    
}