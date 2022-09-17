import {Icon} from './enum/icon.js';

export let seekIcon = (target) => {
    let value;
    const id = target.id;
    if(id.includes(Icon.start)){
        value = Icon.start;
    }else if (id.includes(Icon.stop)){
        value = Icon.stop;
    }else if (id.includes(Icon.delete)){
        value = Icon.delete;
    }else if(id.includes(Icon.right)){
        value = Icon.right;
    }else if(id.includes(Icon.left)){
        value = Icon.left;
    }else if(id.includes(Icon.change)){
        value = Icon.change;
    }
    return value;
}