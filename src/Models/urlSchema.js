import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  shortId: String,
  createdAt: { type: Date, default: Date.now },
});

const URL = mongoose.model('URL', urlSchema);

export default URL;
