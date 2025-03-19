import  Express from 'express';
const app = Express();
import {PORT} from "./config/env.js";

app.get('/', (req, res) => {
    res.send("Welcome to Subscription tracking API ")
})
app.listen(PORT,()=>{
    // console.log("Server started on port " + port);
    console.log(`Subscription Tracking API is running on http://localhost:${ PORT }`)
})


export default app;