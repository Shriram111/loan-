const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  entity: { type: String },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
