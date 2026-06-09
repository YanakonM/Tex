// PromptPay QR Code Generator
// Based on EMV QR Code Specification for Payment Systems

// CRC-16/CCITT-FALSE calculation
function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatTLV(tag, value) {
  const len = value.length.toString().padStart(2, '0');
  return `${tag}${len}${value}`;
}

/**
 * Generate PromptPay QR Code payload
 * @param {string} target - Phone number (0xxxxxxxxx) or National ID (13 digits) or Tax ID
 * @param {number} amount - Amount in THB (0 for any amount)
 * @returns {string} EMV QR Code payload string
 */
export function generatePromptPayPayload(target, amount = 0) {
  // Sanitize target
  const sanitized = target.replace(/[^0-9]/g, '');

  // Determine target type and format
  let formattedTarget;
  let aidTag;

  if (sanitized.length === 13) {
    // National ID or Tax ID
    formattedTarget = sanitized;
    aidTag = '02'; // National ID / Tax ID
  } else if (sanitized.length === 10) {
    // Phone number (convert to international format)
    formattedTarget = '0066' + sanitized.substring(1);
    aidTag = '01'; // Phone number
  } else if (sanitized.length === 15) {
    // e-Wallet ID
    formattedTarget = sanitized;
    aidTag = '03';
  } else {
    throw new Error('Invalid PromptPay target. Use phone (10 digits), National ID (13 digits), or e-Wallet (15 digits)');
  }

  // Build payload
  let payload = '';

  // ID 00: Payload Format Indicator
  payload += formatTLV('00', '01');

  // ID 01: Point of Initiation Method
  // 11 = Static (reusable), 12 = Dynamic (one-time)
  payload += formatTLV('01', amount > 0 ? '12' : '11');

  // ID 29: Merchant Account Information (PromptPay)
  let merchantInfo = '';
  merchantInfo += formatTLV('00', 'A000000677010111'); // PromptPay AID
  merchantInfo += formatTLV(aidTag, formattedTarget);
  payload += formatTLV('29', merchantInfo);

  // ID 53: Transaction Currency (764 = THB)
  payload += formatTLV('53', '764');

  // ID 54: Transaction Amount
  if (amount > 0) {
    payload += formatTLV('54', amount.toFixed(2));
  }

  // ID 58: Country Code
  payload += formatTLV('58', 'TH');

  // ID 63: CRC (placeholder, calculated after)
  const crcData = payload + '6304';
  const crcValue = crc16(crcData);
  payload += formatTLV('63', crcValue);

  return payload;
}

export default generatePromptPayPayload;
