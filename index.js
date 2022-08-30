const express = require ("express");
const db = require('./dbconn/dbconn')
const cors = require ("cors");
const app = express();

app.set("port", process.env. PORT||3000);
app.use(express.json());
app.use(cors());
const port = process.env.PORT


app.get("/" ,(req,res)=>{
    res.json({msg: "/users and /listings"});
})


app.get('/listings',(req,res) => {
    let sql = `Select * from listings;`
    db.query(sql,(err,results) => {
        if(err){
            console.log(err)
        }else{
            res.json({
                status : 200,
                results : results
            })
        }
    })
})


app.listen(port,(err)=>{
    if(err) throw err
    console.log(`server is running at http://localhost:${port}`);
})

const userRoute =  require("./Routes/userRoute")
app.use("/users", userRoute)

const listingsRoute =  require("./Routes/listingsRoute")
app.use("/listings", listingsRoute)

const enquiriesRoute = require("./Routes/enquiriesRoute")
app.use("/enquiries", enquiriesRoute)