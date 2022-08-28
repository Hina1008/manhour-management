import {Icon, Arrow} from './enum/icon.js';

export let seekIcon = (target) => {
    let value;
    const id = target.id;
    if(id.includes(Icon.start)){
        value = Icon.start;
    }else if (id.includes(Icon.stop)){
        value = Icon.stop;
    }else if (id.includes(Icon.delete)){
        value = Icon.delete;
    }else if (id.includes(Icon.edit)){
        value = Icon.edit;
    }else if (id.includes(Icon.save)){
        value = Icon.save;
    }else if (id.includes(Icon.arrow)){
        const className = target.className;
        console.log("arrow")
        console.log(target);
        console.log(target.className)
        if(className.includes(Arrow.up)){
            value = Arrow.up + "_arrow";
        }else if(className.includes(Arrow.down)){
            value = Arrow.down + "_arrow";
        }
    }
    return value;
}