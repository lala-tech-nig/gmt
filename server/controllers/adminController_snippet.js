// GET /api/admin/registrations (Online Public Submissions)
exports.getRegistrations = async (req, res) => {
    try {
        const { limit = 50, page = 1 } = req.query;

        const registrations = await Registration.find()
            .select('-ninHash -imageUrl') // exclude sensitive images/hash if needed
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
