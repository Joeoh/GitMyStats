var gh3 = new Gh3.User("joeoh");
gh3.fetch(function (err, user){
    if(err)
        throw "error in gh3.fetch"
    console.log("User: ", user);
});