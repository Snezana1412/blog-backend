import {Schema, model} from 'mongoose';


const verifySchema = new Schema({
    token: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true,
    }
});

const Verify = model('Verify', verifySchema);
export default Verify;