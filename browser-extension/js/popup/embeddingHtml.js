let setElement = (attribute, childElement, parentElement) => {
    Object.keys(attribute).map(key => 
        childElement.setAttribute(key,attribute[key])
    );
    parentElement.appendChild(childElement);
}

export let embeddingManHour = (name, no, time, rootDiv) =>{
    // 工数名ごとにDivを追加する
    let manHourDiv = document.createElement("div"); // div要素作成
    setElement(
        {"id": no},
        manHourDiv,
        rootDiv
    );

    // 工数に関する情報を持つDivを追加する
    let manHourInfoDiv = document.createElement("div"); // div要素作成
    setElement(
        {"id": "manHourInfo" + no},
        manHourInfoDiv,
        manHourDiv
    );

    let createManHourNameElements = () => {
        // 工数に関する情報を持つDivを追加する
        let manHourNameFormDiv = document.createElement("div"); // div要素作成
        setElement(
            {"id": "manHourNameForm" + no},
            manHourNameFormDiv,
            manHourInfoDiv
        );

        // 工数名を追加する
        let manHourNameParagraph = document.createElement("p"); // p要素作成
        let manHourName = document.createTextNode(name); // テキストノードを作成
        manHourNameParagraph.appendChild(manHourName); // p要素にテキストノードを追加
        setElement({
            "id": "manHourName" + no,
            "class": "man-hour-name"
            },
            manHourNameParagraph,
            manHourNameFormDiv
        );
    }

    // 工数名に関する要素のまとまりを作成
    createManHourNameElements();

    let createManHourTimeElements = () => {
        // アイコンと時間用のDivを追加する
        let manHourControllerFormDiv = document.createElement("div"); // div要素作成
        setElement({
            "id": "manHourControllerForm" + no,
            "class": "man-hour-controller"
            },
            manHourControllerFormDiv,
            manHourInfoDiv);


        // 削除アイコンの追加
        let deleteImg = document.createElement("img"); // img要素作成
        setElement({
            "src": "/img/popup/delete/delete.png",
            "id": "delete" + no,
            "class": "controller-icon delete",
            "name": no
            },
            deleteImg,
            manHourControllerFormDiv
        );

        // 再生アイコンの追加
        let startImg = document.createElement("img"); // img要素作成
        setElement({
            "src": "/img/popup/start/start.png",
            "id": "start" + no,
            "class": "controller-icon start",
            "name": no
            },
            startImg,
            manHourControllerFormDiv
        );

        // 停止アイコンの追加
        let stopImg = document.createElement("img"); // img要素作成
        setElement({
            "src": "/img/popup/stop/stop.png",
            "id": "stop" + no,
            "class": "controller-icon stop",
            "name": no
            },
            stopImg,
            manHourControllerFormDiv
        );
        
        // 工数時間の追加
        let manHourTimeParagraph = document.createElement("p"); // p要素作成
        let manHourTime = document.createTextNode(time); // テキストノードを作成
        manHourTimeParagraph.appendChild(manHourTime); // p要素にテキストノードを追加
        setElement({
            "id": "manHourTime" + no,
            "class": "time"
            },
            manHourTimeParagraph,
            manHourControllerFormDiv
        );

        // 編集アイコンの追加
        let editImg = document.createElement("img"); // img要素作成
        setElement({
            "src": "/img/popup/edit/edit.png",
            "id": "edit" + no,
            "class": "edit",
            "name": no
            },
            editImg,
            manHourControllerFormDiv
        );
    }

    // 時間に関する要素のまとまりを作成
    createManHourTimeElements();

    let createArrowElements = () => {
        // 矢印用のDivを追加する
        let arrowDiv = document.createElement("div"); // div要素作成
        setElement(
            {"id": "arrowForm" + no},
            arrowDiv,
            manHourInfoDiv
        );

        // 下矢印アイコンの追加
        let downArrowImg = document.createElement("img"); // img要素作成
        setElement({
            "src": "/img/popup/down_arrow/down_arrow.png",
            "id": "arrow" + no,
            "class": "controller-icon down",
            "name": no
            },
            downArrowImg,
            arrowDiv
        );
    }

    // 編集画面を開閉する矢印に関する要素のまとまりを作成
    createArrowElements();

    let createLineElements = () => {
        // 工数名毎に区切る用の横線のDivを追加する
        let lineDiv = document.createElement("div"); // div要素作成
        setElement(
            {"id": "lineForm" + no},
            lineDiv,
            manHourInfoDiv
        );

        // 横線を追加
        let lineHr = document.createElement("hr"); // img要素作成
        setElement(
            {"class": "hr3"},
            lineHr,
            lineDiv
        );
    }

    // 工数名毎に区切る用の横線に関する要素のまとまりを作成
    createLineElements();

}


export let deleteErrorMessage = (parent) =>{
    // エラーメッセージが既に表示されていたら削除する
    while(parent.lastChild){
        parent.removeChild(parent.lastChild);
    }
}

export let emmbeddingErrorMessage = (message, id, className, idName) => {
    let divElement = document.getElementById(id);

    // エラーメッセージが既に表示されていたら削除する
    deleteErrorMessage(divElement);

    let pElement = document.createElement("p"); // p要素作成
    let errorMessage = document.createTextNode(message); // テキストノードを作成
    pElement.appendChild(errorMessage); // p要素にテキストノードを追加
    setElement({
        "id": idName,
        "class": className
        },
        pElement,
        divElement
    );
}

export let openEditTimeForm = (no) =>{
    let manHourFormDiv = document.getElementById("manHourInfo"+ no);

    let arrowImg = document.getElementById("arrow" + no);
    arrowImg.setAttribute("src", "/img/popup/up_arrow/up_arrow_white.png");
    arrowImg.setAttribute("class", "controller-icon up")

    // 編集用のDivを追加する
    let manHourEditFormDiv = document.createElement("div"); // div要素作成
    setElement({
        "id": "manHourEditForm" + no,
        "class": "man-hour-edit-form"
        },
        manHourEditFormDiv,
        manHourFormDiv
    );

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

    secondInput.setAttribute("id","second" + no);
    secondInput.setAttribute("class","time-edit");
    secondInput.setAttribute("name",no);
    
    manHourEditFormDiv.appendChild(hourInput);
    manHourEditFormDiv.appendChild(separateP1);
    manHourEditFormDiv.appendChild(minuteInput);
    manHourEditFormDiv.appendChild(separateP2);
    manHourEditFormDiv.appendChild(secondInput);
    
    // 編集アイコンの追加
    let saveImg = document.createElement("img"); // img要素作成
    setElement({
        "src": "/img/popup/save/save.png",
        "id": "save" + no,
        "class": "controller-icon save",
        "name": no
        },  
        saveImg,
        manHourEditFormDiv
    )

    // 注意喚起用のDivを追加する
    let editFormAttentionDiv = document.createElement("div"); // div要素作成

    let attentionMessageParagraph = document.createElement("p");
    let attentionMessage = "※ 測れる時間の最大値は23:59:59です。"
    let attentionMessageNode = document.createTextNode(attentionMessage);
    attentionMessageParagraph.appendChild(attentionMessageNode);
    editFormAttentionDiv.appendChild(attentionMessageParagraph);

    setElement({
        "id": "editFormAttentionMessage" + no,
        "class": "edit-form"
        },
        editFormAttentionDiv,
        manHourFormDiv
    )

    // エラー用のDivを追加する
    let editFormErrorDiv = document.createElement("div"); // div要素作成
    setElement({
        "id": "editFormErrorMessage" + no,
        "class": "edit-form-error-message"
        },
        editFormErrorDiv,
        manHourFormDiv
    );
}

export let closeEditTimeForm = (no) =>{
    let arrowImg = document.getElementById("arrow" + no);
    arrowImg.setAttribute("src", "/img/popup/down_arrow/down_arrow_white.png");
    arrowImg.setAttribute("class", "controller-icon down")

    let editImg = document.getElementById("edit" + no);
    editImg.setAttribute("src", "/img/popup/edit/edit.png");

    let manHourFormDiv = document.getElementById("manHourEditForm"+ no);
    manHourFormDiv.remove();

    let editFormAttentionDiv = document.getElementById("editFormAttentionMessage" + no);
    editFormAttentionDiv.remove();

    let editFormErrorDiv = document.getElementById("editFormErrorMessage"+ no);
    editFormErrorDiv.remove();
}