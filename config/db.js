if(process.env.NODE_ENV =="production"){
    module.exports = {mongoURI:"mongodb+srv://jorge:jorge1989@cluster0-yv5la.mongodb.net/test?retryWrites=true&w=majority"}

}else{
    module.exports = {mongoURI: "mongo://localhost/blogapp"}

}