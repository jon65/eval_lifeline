const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const opts = { toJSON: { virtuals: true } };
/*
pet - user -> many to one relationship
*/
const PetSchema = new Schema(
  {
    pet_name: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    }, //user fk
  },
  opts
);

//on delete -> cascade
PetSchema.post("findOneAndDelete", async function (pet) {
  if (pet) {
    await User.deleteMany({
      //filter
      $pull: { pet_id: pet._id },
    });
  }
});

module.exports = mongoose.model("Pet", PetSchema);
