const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: true,
    },
  number: {
    type: String,
    required: [true, "Phone number required"],
    validate: {
        //Regex selittää ^ alku, & loppu, \d{2,3} = kaks tai useampi numero, yhteensä vähintään 8 merkkiä
        validator:  function(v) {return /^\d{2,3}-\d+$/.test(v) && v.length >= 8;},
        message: props => `${props.value} is not a valid phone number! (format: XX-XXXXXXX)`
    }
  },
});

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  });

module.exports = mongoose.model('Contact', contactSchema);