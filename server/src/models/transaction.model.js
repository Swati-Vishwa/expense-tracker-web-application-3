import mongoose, { Schema, Types } from "mongoose"

const transactionSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  transactionType: {
    type: String,
    required: [true, "Transaction type is required"],
    enum: {
      value: ["Income", "Expense"],
      message: "Transaction type must be Income or Expense"
    }
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