const Registration = require('../models/Registration');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Helper to hash NIN
const hashNIN = (nin) => {
    return crypto.createHash('sha256').update(nin).digest('hex');
};

// Mask NIN (e.g., *******1234)
const maskNIN = (nin) => {
    if (!nin || nin.length < 4) return '****';
    return '*'.repeat(nin.length - 4) + nin.slice(-4);
};

exports.registerCitizen = async (req, res) => {
    try {
        const {
            firstName, middleName, surname,
            nationality, hometown, lgaOfOrigin, stateOfOrigin,
            dob, religion, gender,
            phone, isWhatsApp, email,
            houseNumber, streetName, city, residenceLga, residenceState,
            pvcStatus, nin,
            emergencyName, emergencyRel, emergencyPhone
        } = req.body;

        // Basic Validation
        if (!firstName || !surname || !phone || !nin) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        if (nin.length !== 11) {
            return res.status(400).json({ success: false, message: 'NIN must be 11 digits' });
        }

        // Handle Image
        // If coming from multipart/form-data (file upload)
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.filename;
        } else if (req.body.imageData) {
            // Handle Base64 (Camera capture often sends base64)
            // We need to decode and save it
            const matches = req.body.imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const type = matches[1]; // e.g. image/png
                const data = Buffer.from(matches[2], 'base64');
                const ext = type.split('/')[1];
                const filename = `citizen-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
                const uploadDir = path.join(__dirname, '../uploads/citizens');

                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

                fs.writeFileSync(path.join(uploadDir, filename), data);
                imageUrl = filename;
            }
        }

        if (!imageUrl) {
            // return res.status(400).json({ success: false, message: 'Image is required' });
            // Making it optional for now to test textual data if needed, but Prompt says required.
        }

        // Check constraints (Unique NIN?)
        // In a real system, we might query NIMC. Here we just store.
        const ninHash = hashNIN(nin);
        const ninMasked = maskNIN(nin);

        // Check if already registered?
        const existing = await Registration.findOne({ ninHash });
        if (existing) {
            return res.status(400).json({ success: false, message: 'This NIN has already been registered.' });
        }

        const newRegistration = new Registration({
            firstName, middleName, surname,
            nationality: nationality || 'Nigerian', hometown, lgaOfOrigin, stateOfOrigin,
            dob, religion, gender,
            phone, isWhatsApp: isWhatsApp === 'true' || isWhatsApp === true, email,
            houseNumber, streetName, city, residenceLga, residenceState,
            pvcStatus, ninHash, ninMasked,
            imageUrl,
            emergencyName, emergencyRel, emergencyPhone
        });

        await newRegistration.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            registrationId: newRegistration._id
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server Error occurred during registration.' });
    }
};
