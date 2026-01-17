const mongoose = require('mongoose');

const NINRecordSchema = new mongoose.Schema({
    ninHash: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    ninMasked: String,
    firstName: String,
    lastName: String,
    gender: String,
    dateOfBirth: Date, // parsed from 2001-05-28
    state: String,
    lga: String,
    ward: String,
    phone: String,
    pvcStatus: {
        type: String,
        enum: ['YES', 'NO'],
        default: 'NO'
    },
    email: String,
    address: String,
    importedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('NINRecord', NINRecordSchema);
