import {setElement} from './embeddingHtml.js'

export let homeForm = (no) => {
    let manHourName = document.getElementById("manHourName"+no);
    let value = manHourName.innerHTML.replace("&","＆");
    manHourName.remove();

    let manHourNameForm = document.getElementById("manHourNameForm"+no);
    let manHourNameInput = document.createElement("input");
    setElement({
        "id": "manHourNameInput" + no,
        "class": "man-hour-name-input",
        "value":value,
        },
        manHourNameInput,
        manHourNameForm
    );

}

export let editForm = (no) => {

}

export let forms = {
    0:homeForm,
    1:editForm
}