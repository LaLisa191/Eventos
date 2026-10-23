const { ReportRepository } = require('../../../../application/ports');
const Report = require('../models/Report');

class MongooseReportRepository extends ReportRepository {
  async create(data) {
    return (await Report.create(data)).toObject();
  }

  listByEvent(eventId) {
    return Report.find({ eventId }).sort({ generatedAt: -1 }).lean();
  }
}

module.exports = MongooseReportRepository;
