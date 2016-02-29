(function () {
    /*
     * Extract host infos from the location.
     * Example: "?_host_Info=Powerpoint|Win32|16.01|en-US"
     */

/*
    const client = window.location.search.split('=')[2].split('|')[0];
    const os = window.location.search.split('=')[2].split('|')[1];
    const version = window.location.search.split('=')[2].split('|')[2];
    const locale = window.location.search.split('=')[2].split('|')[3];

    Office.initialize = () => {
        $('body').addClass(client.toLowerCase());
        $("#usernameSubmit").click(function () {
            onSubmit();
        });
    };


    function onSubmit() {
        "use strict";
        let username = $('#username').val();
        event.preventDefault();
        if (client == "Excel") {
            Excel.run(function (ctx) {
                var range = ctx.workbook.worksheets.getItem("Sheet1").getRange("A1:D2");
                var headers = ["Username", "Name", "Location", "Member Since"];
                var userData = [];
                //TODO: Check for null before setting values
                var gh3 = new Gh3.User(username);
                gh3.fetch(function (err, user) {
                    if (err) throw "error in gh3.fetch";
                    userData = [user.login, user.name, user.location, user.created_at];
                    range.values = [headers, userData];
                    ctx.sync();
                });

            }).catch(function (error) {
                console.log(error);
            });
        } else if (client == "Word") {

            var gh3 = new Gh3.User(username);
            gh3.fetch(function (err, user) {
                if (!err) {
                    var userData = [user.login, user.name, user.location, user.created_at];
                    insertText(userData);
                } else {
                    if (err == "Error: Not Found") {
                        showError("User not found", "Please check your spelling and try again");
                    } else {
                        showError("Error", "An error occurred when fetching the user info. Please try again");
                    }
                }

            });
        }
        return false;
    }

    function insertHtml(html){
        insertData(html, "html");
    }

    function insertText(text){
        insertData(text,"text");
    }

    function insertOoxml(ooxml){
        Word.run(function (context) {

                var ooxmlText = "<w:p xmlns:w='http://schemas.microsoft.com/office/word/2003/wordml'>" +
                    "<w:r><w:rPr><w:b/><w:b-cs/><w:color w:val='FF0000'/><w:sz w:val='28'/><w:sz-cs w:val='28'/>" +
                    "</w:rPr><w:t>Hello world (this should be bold, red, size 14).</w:t></w:r></w:p>";

                // Create a range proxy object for the current selection.
                var range = context.document.getSelection();

                // Queue a commmand to insert OOXML at the end of the selection.
                range.insertOoxml(ooxmlText, Word.InsertLocation.end);

                // Synchronize the document state by executing the queued-up commands,
                // and return a promise to indicate task completion.
                return context.sync().then(function () {
                    console.log('Inserted the OOXML at the end of the selection.');
                });
            })
            .catch(function (error) {
                console.log('Error: ' + JSON.stringify(error));
                if (error instanceof OfficeExtension.Error) {
                    console.log('Debug info: ' + JSON.stringify(error.debugInfo));
                }
            });
       // insertData(ooxmlText,"ooxml");
    }

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
            default:
                coercionType = Office.CoercionType.Text;
                break;
        }

        console.log("Inserting: " + coercionType);
        if (client == "Word") {
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

    function showError(title, text) {
        $('#errorModal').removeClass('hidden');
        $('#errorModal #errorTitle').text(title);
        $('#errorModal #errorBody').text(text);
        $('#errorModal #errorClose').click(function () {
            $('#errorModal').addClass('hidden');
        });

    }
*/

})();