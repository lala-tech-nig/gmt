const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    details: String,
    ipAddress: String,
    targetRecord: String, // ID of record affected
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
