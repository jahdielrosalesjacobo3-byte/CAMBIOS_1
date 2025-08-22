// Tipos de transferencia
export interface TransferData {
  amount: number;
  fromAddress: string;
  toAddress: string;
  timestamp: number;
  transactionId: string;
}

export interface QRTransferData extends TransferData {
  signature: string;
  version: string;
  type: string;
}

// Tipos de wallet
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

// Tipos de UI
export interface TransferFormData {
  toAddress: string;
  amount: number;
  method: 'ultrasonic' | 'qr';
}

export interface TransactionHistoryItem {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  address: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  method: 'ultrasonic' | 'qr' | 'blockchain';
}

// Tipos de configuración
export interface AppConfig {
  isOnline: boolean;
  ultrasonicEnabled: boolean;
  qrEnabled: boolean;
  blockchainEnabled: boolean;
}

// Tipos de eventos
export interface TransferEvent {
  type: 'transfer_sent' | 'transfer_received' | 'transfer_failed';
  data: TransferData;
  result: TransferResult;
}

// Tipos de navegación
export type RootStackParamList = {
  Home: undefined;
  Transfer: undefined;
  Receive: undefined;
  History: undefined;
  Settings: undefined;
  QRScanner: undefined;
};
