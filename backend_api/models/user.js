const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Pet = require("./pet");

const opts = { toJSON: { virtuals: true } };
/*
user - friends -> many to many unary relationship
user - pets -> one to many relationship 
*/
const UserSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    friend_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    pet_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pet",
        default: [],
      },
    ],
  },
  opts
);

//on delete -> cascade
UserSchema.post("findOneAndDelete", async function (user) {
  if (user) {
    await Pet.deleteMany({
      //filter
      $pull: { user_id: user._id },
    });
  }
});

module.exports = mongoose.model("User", UserSchema);
