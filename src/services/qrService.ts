import QRCode from 'react-native-qrcode-svg';

export interface QRTransferData {
  amount: number;
  fromAddress: string;
  toAddress: string;
  timestamp: number;
  transactionId: string;
  signature: string; // Para verificar autenticidad
}

export class QRService {
  private static instance: QRService;

  public static getInstance(): QRService {
    if (!QRService.instance) {
      QRService.instance = new QRService();
    }
    return QRService.instance;
  }

  // Generar QR code con datos de transferencia
  generateTransferQR(data: QRTransferData): string {
    const qrData = JSON.stringify({
      ...data,
      version: '1.0',
      type: 'transfer',
      timestamp: Date.now(),
    });
    
    return qrData;
  }

  // Validar datos del QR
  validateQRData(qrString: string): QRTransferData | null {
    try {
      const data = JSON.parse(qrString);
      
      // Validar estructura
      if (!data.amount || !data.fromAddress || !data.toAddress || !data.transactionId) {
        return null;
      }

      // Validar timestamp (no más de 5 minutos de antigüedad)
      const now = Date.now();
      if (now - data.timestamp > 5 * 60 * 1000) {
        return null;
      }

      return data as QRTransferData;
    } catch (error) {
      console.error('Error validando QR:', error);
      return null;
    }
  }

  // Generar firma digital simple (en producción usaríamos criptografía real)
  generateSignature(data: Omit<QRTransferData, 'signature'>): string {
    const dataString = `${data.amount}${data.fromAddress}${data.toAddress}${data.transactionId}${data.timestamp}`;
    return this.simpleHash(dataString);
  }

  // Hash simple (en producción usaríamos SHA-256)
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Verificar firma
  verifySignature(data: QRTransferData): boolean {
    const { signature, ...dataWithoutSignature } = data;
    const expectedSignature = this.generateSignature(dataWithoutSignature);
    return signature === expectedSignature;
  }
}

export default QRService.getInstance();
