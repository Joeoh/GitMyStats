function insertData(data, type) {
    type = type.toLowerCase();
    var coercionType = Office.CoercionType.Text;
    switch (type){
        case "text":
            coercionType = Office.CoercionType.Text;
            break;
        case "html":
            coercionType = Office.CoercionType.Html;
            break;
        case "ooxml":
            coercionType = Office.CoercionType.Ooxml;
            break;
        case "image":
            coercionType = Office.CoercionType.Image;
            break;
        default:
            coercionType = Office.CoercionType.Text;
            break;
    }

    console.log("Inserting: " + coercionType);
    if (client == "Word" || client == "PowerPoint") {


        if (Office.context.requirements.isSetSupported('ImageCoercion', '1.1')) {
            console.log("Is supported");
            // insertViaImageCoercion();
        } else {
            console.log("Is not supported");
        }


        Office.context.document.setSelectedDataAsync(data, {coercionType: coercionType} , (res) => {
            if (res.status === 'failed') {
                if(res.error.name == "Data Write Error"){
                    showError("Unable to insert", "Please select an area in the document to insert the data");
                } else {
                    showError("Sorry!", "An error occurred inserting the data - please try again \n Error code: " + res.error.name);
                    console.log(res.error);
                }
            }
        });
    }
}