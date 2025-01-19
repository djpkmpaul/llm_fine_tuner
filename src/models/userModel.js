import mongoose, { Schema } from 'mongoose';
import Llm from "./llmModel";

if (mongoose.models.users) {
  delete mongoose.models.users
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  //? For password reset
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,

  //? For verifying user
  verifyToken: String,
  verifyTokenExpiry: Date,

  llms: [{
    type: Schema.Types.ObjectId,
    ref: "llms",
    required: false,
    default: [], // Set to empty array as default
  }]
});


// Recompile the model if it was deleted from the cache
const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
