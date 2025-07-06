import { app } from './src/app';
import dotenv from 'dotenv';

dotenv.config();
const PORT :string =process.env.PORT || "3000";


app.listen(PORT,()=>{
    console.log(`listen on port ${PORT}`)
});