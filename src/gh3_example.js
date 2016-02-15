var gh3 = new Gh3.User("k33g");
gh3.fetch(function (err, resUser){
    if(err)
        throw "outch ..."
    console.log("User: ", resUser);
});