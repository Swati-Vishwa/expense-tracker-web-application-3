import mongoose, { Schema, Types } from "mongoose"

const transactionSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    required: [true, "Type is required"],
    enum: { values: ["income", "expense"], message: "Type must be income or expense" },
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0.01, "Amount must be greater than 0"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  Date: {
    type: Date,
    default: Date.now
  }
}, {timestamps: true})

transactionSchema.index({user: 1, date: -1});

export const Transaction = mongoose.model("Transaction", transactionSchema)  