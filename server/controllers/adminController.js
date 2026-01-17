const Registration = require('../models/Registration');
const NINRecord = require('../models/NINRecord');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const crypto = require('crypto');
const xlsx = require('xlsx');
const axios = require('axios');
const cloudinary = require('../utils/cloudinaryConfig');

// Helper
const hashNIN = (nin) => crypto.createHash('sha256').update(nin).digest('hex');
const maskNIN = (nin) => nin.substring(0, 4) + '****' + nin.substring(nin.length - 4);

// GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalNINs = await NINRecord.countDocuments();
        const totalRegistrations = await Registration.countDocuments();
        const totalPVC = await Registration.countDocuments({ pvcStatus: 'YES' });
        const totalNonPVC = await Registration.countDocuments({ pvcStatus: 'NO' });

        // New Registrations (Last 24h)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const newToday = await Registration.countDocuments({ createdAt: { $gte: oneDayAgo } });

        res.json({
            success: true,
            stats: { totalNINs, totalRegistrations, totalPVC, totalNonPVC, newToday }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// GET /api/admin/citizens
exports.getCitizens = async (req, res) => {
    try {
        const { pvcStatus, state, limit = 50, page = 1 } = req.query;

        const query = {};
        if (pvcStatus) query.pvcStatus = pvcStatus;
        if (state) query.state = state; // Note: Schema field is 'state' in NINRecord, 'residenceState' in Registration.
        // For now, let's query REGISTRATION public data as primary citizen view, or switch to NINRecord?
        // User context implies this is "Citizen Registry" which usually combines both.
        // Given the bulk upload, we should probably view the NINRecords.
        // Let's assume this view is for NINRecords (Bulk + Registered updates).

        const citizens = await NINRecord.find(query)
            .select('-ninHash')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ importedAt: -1 });

        const total = await NINRecord.countDocuments(query);

        res.json({
            success: true,
            count: citizens.length,
            total,
            data: citizens
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// POST /api/admin/upload-nins
exports.uploadNINs = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a CSV or Excel file' });
    }

    const results = [];
    // req.file.path contains the Cloudinary URL
    const cloudinaryUrl = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // Download file from Cloudinary to temp location
    const tempFilePath = path.join(tempDir, `temp-${Date.now()}${ext}`);

    try {
        // Download file from Cloudinary
        const response = await axios({
            method: 'GET',
            url: cloudinaryUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(tempFilePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Process the downloaded file
        if (ext === '.csv') {
            fs.createReadStream(tempFilePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    await processRecords(results, res, tempFilePath, req.file.public_id);
                });
        } else if (ext === '.xlsx' || ext === '.xls') {
            const workbook = xlsx.readFile(tempFilePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet);
            await processRecords(jsonData, res, tempFilePath, req.file.public_id);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error processing file' });
        // Cleanup temp file
        try { fs.unlinkSync(tempFilePath); } catch (e) { }
        // Delete from Cloudinary
        if (req.file.public_id) {
            try { await cloudinary.uploader.destroy(req.file.public_id, { resource_type: 'raw' }); } catch (e) { }
        }
    }
};

async function processRecords(data, res, filePath, cloudinaryPublicId) {
    let count = 0;
    let errors = 0;

    for (const row of data) {
        // Map keys from row (flexible key matching)
        // CSV keys: nin, first_name, last_name, gender, date_of_birth, state, lga, ward, phone, has_pvc, email, house_address
        const nin = row.nin || row.NIN;
        if (!nin) continue; // Skip if no NIN

        const ninStr = String(nin).trim();
        if (ninStr.length < 11) continue; // Basic validation

        const record = {
            ninHash: hashNIN(ninStr),
            ninMasked: maskNIN(ninStr),
            firstName: row.first_name || row.FirstName,
            lastName: row.last_name || row.LastName || row.surname,
            gender: row.gender || row.Gender,
            dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth) : null,
            state: row.state || row.State,
            lga: row.lga || row.LGA,
            ward: row.ward || row.Ward,
            phone: row.phone || row.Phone,
            pvcStatus: (row.has_pvc || row.PVCStatus || 'NO').toUpperCase(),
            email: row.email || row.Email,
            address: row.house_address || row.Address
        };

        try {
            // Upsert: Update if exists, Insert if new
            await NINRecord.findOneAndUpdate(
                { ninHash: record.ninHash },
                record,
                { upsert: true, new: true }
            );
            count++;
        } catch (err) {
            console.error('Record Error:', err.message);
            errors++;
        }
    }

    // Cleanup temp file
    try { fs.unlinkSync(filePath); } catch (e) { }

    // Delete from Cloudinary to save storage space (documents are temporary)
    if (cloudinaryPublicId) {
        try {
            await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: 'raw' });
        } catch (e) {
            console.error('Error deleting from Cloudinary:', e.message);
        }
    }

    res.json({
        success: true,
        message: `Processed ${count} records successfully. ${errors} errors.`,
        count,
        errors
    });
}

// GET /api/admin/registrations (Online Public Submissions)
exports.getRegistrations = async (req, res) => {
    try {
        const { limit = 50, page = 1 } = req.query;

        const registrations = await Registration.find()
            .select('-ninHash') // exclude sensitive hash, show image
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await Registration.countDocuments();

        res.json({
            success: true,
            count: registrations.length,
            total,
            data: registrations
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
