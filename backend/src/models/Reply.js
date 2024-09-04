const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    postType: {
      type: String,
      required: true,
      enum: ["Gallery", "Board", "OtherModel"],
    },
    writer: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

replySchema.virtual("post", {
  ref: (doc) => doc.postType,
  localField: "postId",
  foreignField: "_id",
  justOne: true,
});

// 모델이 이미 존재하는지 확인한 후, 정의합니다.
const Reply = mongoose.models.Reply || mongoose.model("Reply", replySchema);

module.exports = Reply;
