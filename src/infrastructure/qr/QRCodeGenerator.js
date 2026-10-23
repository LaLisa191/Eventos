const QRCode = require('qrcode');
const { QrCodeGenerator } = require('../../application/ports');

class QRCodeGenerator extends QrCodeGenerator {
  toDataUrl(text) {
    return QRCode.toDataURL(text, { width: 400, margin: 2, errorCorrectionLevel: 'H' });
  }
}

module.exports = QRCodeGenerator;
