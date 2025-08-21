import ultrasonicService, { TransferData } from './ultrasonicService';
import qrService, { QRTransferData } from './qrService';

export interface WalletBalance {
  address: string;
  balance: number;
  pendingTransactions: TransferData[];
}

export interface TransferResult {
  success: boolean;
  transactionId: string;
  method: 'ultrasonic' | 'qr' | 'blockchain';
  error?: string;
}

export class WalletService {
  private static instance: WalletService;
  private balance: WalletBalance;
  private isOnline = false;

  private constructor() {
    // Inicializar con datos de ejemplo
    this.balance = {
      address: this.generateAddress(),
      balance: 1000, // Saldo inicial
      pendingTransactions: [],
    };
  }

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  // Obtener balance actual
  getBalance(): WalletBalance {
    return { ...this.balance };
  }

  // Realizar transferencia offline
  async transferOffline(
    toAddress: string, 
    amount: number, 
    method: 'ultrasonic' | 'qr' = 'ultrasonic'
  ): Promise<TransferResult> {
    try {
      // Validar saldo
      if (this.balance.balance < amount) {
        return {
          success: false,
          transactionId: '',
          method,
          error: 'Saldo insuficiente',
        };
      }

      const transactionId = this.generateTransactionId();
      const transferData: TransferData = {
        amount,
        fromAddress: this.balance.address,
        toAddress,
        timestamp: Date.now(),
        transactionId,
      };

      let success = false;

      if (method === 'ultrasonic') {
        success = await this.sendViaUltrasonic(transferData);
      } else if (method === 'qr') {
        success = await this.sendViaQR(transferData);
      }

      if (success) {
        // Actualizar balance local
        this.balance.balance -= amount;
        this.balance.pendingTransactions.push(transferData);

        return {
          success: true,
          transactionId,
          method,
        };
      } else {
        return {
          success: false,
          transactionId,
          method,
          error: 'Error en la transferencia',
        };
      }
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        method,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Recibir transferencia offline
  async receiveTransfer(transferData: TransferData): Promise<TransferResult> {
    try {
      // Validar que no sea una transacción duplicada
      const isDuplicate = this.balance.pendingTransactions.some(
        tx => tx.transactionId === transferData.transactionId
      );

      if (isDuplicate) {
        return {
          success: false,
          transactionId: transferData.transactionId,
          method: 'ultrasonic',
          error: 'Transacción duplicada',
        };
      }

      // Actualizar balance
      this.balance.balance += transferData.amount;
      this.balance.pendingTransactions.push(transferData);

      return {
        success: true,
        transactionId: transferData.transactionId,
        method: 'ultrasonic',
      };
    } catch (error) {
      return {
        success: false,
        transactionId: transferData.transactionId,
        method: 'ultrasonic',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Sincronizar con blockchain cuando hay conexión
  async syncWithBlockchain(): Promise<void> {
    if (!this.isOnline) {
      console.log('Sin conexión a internet - sincronización pendiente');
      return;
    }

    try {
      // Aquí iría la lógica de sincronización con Monad
      console.log('Sincronizando transacciones pendientes con blockchain...');
      
      // Simular sincronización
      await this.delay(2000);
      
      // Limpiar transacciones pendientes después de sincronizar
      this.balance.pendingTransactions = [];
      
      console.log('Sincronización completada');
    } catch (error) {
      console.error('Error en sincronización:', error);
    }
  }

  // Escuchar transferencias entrantes
  async startListening(): Promise<void> {
    try {
      await ultrasonicService.startListening((data) => {
        this.receiveTransfer(data);
      });
    } catch (error) {
      console.error('Error iniciando escucha:', error);
    }
  }

  // Detener escucha
  async stopListening(): Promise<void> {
    await ultrasonicService.stopListening();
  }

  // Métodos privados
  private async sendViaUltrasonic(data: TransferData): Promise<boolean> {
    try {
      await ultrasonicService.sendData(data);
      return true;
    } catch (error) {
      console.error('Error enviando por ultrasonido:', error);
      return false;
    }
  }

  private async sendViaQR(data: TransferData): Promise<boolean> {
    try {
      const qrData: QRTransferData = {
        ...data,
        signature: qrService.generateSignature(data),
      };
      
      const qrString = qrService.generateTransferQR(qrData);
      console.log('QR generado:', qrString);
      
      return true;
    } catch (error) {
      console.error('Error generando QR:', error);
      return false;
    }
  }

  private generateAddress(): string {
    return '0x' + Math.random().toString(16).substr(2, 40);
  }

  private generateTransactionId(): string {
    return 'tx_' + Date.now() + '_' + Math.random().toString(16).substr(2, 8);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Getters y setters
  setOnlineStatus(online: boolean): void {
    this.isOnline = online;
    if (online) {
      this.syncWithBlockchain();
    }
  }

  isConnected(): boolean {
    return this.isOnline;
  }
}

export default WalletService.getInstance();
