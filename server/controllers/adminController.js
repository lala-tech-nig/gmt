const Registration = require('../models/Registration');
const NINRecord = require('../models/NINRecord');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const crypto = require('crypto');
const xlsx = require('xlsx');

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
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    try {
        if (ext === '.csv') {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    await processRecords(results, res, filePath);
                });
        } else if (ext === '.xlsx' || ext === '.xls') {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet);
            await processRecords(jsonData, res, filePath);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error processing file' });
        try { fs.unlinkSync(filePath); } catch (e) { }
    }
};

async function processRecords(data, res, filePath) {
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

    // Cleanup
    try { fs.unlinkSync(filePath); } catch (e) { }

    res.json({
        success: true,
        message: `Processed ${count} records successfully. ${errors} errors.`,
        count,
        errors
    });
}
