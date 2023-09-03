import app from './app';
import env from './util/validateEnv';
import mongoose from 'mongoose';



const port = env.PORT;



mongoose.connect(env.DB_URL).then(()=>{console.log("Database Connected")
app.listen(port, ()=>{
    console.log("App listening at port: "+ port)
})})




