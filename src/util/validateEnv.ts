import {cleanEnv} from 'envalid';
import {str,port} from 'envalid/dist/validators';
export default cleanEnv(process.env , {
    DB_URL : str(), 
    PORT: port()
})