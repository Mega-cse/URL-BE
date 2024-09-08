import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    randomString: String,
    expirationTimestamp: Number
});

export default mongoose.model('User', UserSchema);
