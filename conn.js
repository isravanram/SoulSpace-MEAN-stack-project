const mongoose=require('mongoose');
// Connect localhost

// mongoose.connect("mongodb://localhost:27017/YourSpaceDB",{
//   useNewUrlParser:true,
//   useUnifiedTopology:true,
//   useCreateIndex:true
// }).then(()=>{
//     console.log('connection successful');
// }).catch((e)=>{
//     console.log("no connection");
// });

mongoose.connect("mongodb+srv://sravan:sravan@cluster0.zjuup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
mongoose.connection.once('open',function(){
    console.log("Connection success");
}).on('error',function(error){
    console.log("Error connecting ",error);
})