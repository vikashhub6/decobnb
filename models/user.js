const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: String,
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  userType: {
    type: String,
    enum: ['guest', 'host', 'employee'],
    default: 'guest'
  },
  mobileNumber: {
    type: String,
    required: true,
    
   
  },
  
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event_class'
  }],
  shopName: {
    type: String,
    required: false,
    default: null,
    unique: true,   // ✅ shopName unique
    sparse: true    // ✅ null values allow hongi (guest/employee k liye)
  }
});

userSchema.index({ email: 1, userType: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);