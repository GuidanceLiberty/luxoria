import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    photo: { type: String },
    role: { type: String, default: 'user' },
    wishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null }],
}, {timestamps: true});

export const User = mongoose.model('users', userSchema); 