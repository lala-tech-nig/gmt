const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    // Personal Data
    firstName: { type: String, required: true },
    middleName: String,
    surname: { type: String, required: true },
    nationality: { type: String, default: 'Nigerian' },
    hometown: String,
    lgaOfOrigin: String,
    stateOfOrigin: String,
    dob: Date,
    religion: String,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },

    // Contact Info
    phone: { type: String, required: true },
    isWhatsApp: { type: Boolean, default: false },
    email: String,

    // Address
    houseNumber: String,
    streetName: String,
    city: String,
    residenceLga: String,
    residenceState: String,

    // Identity
    pvcStatus: { type: String, enum: ['YES', 'NO'] },
    ninHash: { type: String, required: true }, // Hashed for security
    ninMasked: { type: String, required: true }, // For display (e.g. ***123)

    // Images
    imageUrl: { type: String, required: true }, // Path to uploaded/captured image

    // Emergency Contact
    emergencyName: String,
    emergencyRel: String,
    emergencyPhone: String,

    // Meta
    status: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'CONTACTED', 'COMPLETED'],
        default: 'PENDING'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', RegistrationSchema);
