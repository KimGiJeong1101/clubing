const mongoose = require("mongoose");
const { getNextSequenceValue } = require("../util/sequence");

const eventSchema = mongoose.Schema(
  {
    _id: Number,
    clubNumber: Number,
    writer: String,
    title: String,
    category: String,
    content: { type: String, default: false },
  },
  { timestamps: true },
);


eventSchema.pre("save", async function (next) {
  if (this.isNew) {
    this._id = await getNextSequenceValue("eventId");
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
