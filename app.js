import  Express from 'express';

const app = Express();

import {PORT} from "./config/env.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);



app.get('/', (req, res) => {
    res.send("Welcome to Subscription tracking API ")
})
app.listen(PORT,()=>{
    // console.log("Server started on port " + port);
    console.log(`Subscription Tracking API is running on http://localhost:${ PORT }`)
})


export default app;