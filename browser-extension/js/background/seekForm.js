let checkForm = (no, location) => {
    if(location == "last"){
        console.log(no);
        console.log(Object.keys(Form).length )
        return no == Object.keys(Form).length ;
    }
    return no == 0;
}