const mongoose = require("mongoose");
const { getNextSequenceValue } = require("../util/sequence");

const eventSchema = mongoose.Schema(
  {
    _id: Number,
    writer: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: { type: String, default: false },
    cardImage: {
      type: String,
      required: false,
    },
    cardTitle: {
      type: String,
      required: false,
    },
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
