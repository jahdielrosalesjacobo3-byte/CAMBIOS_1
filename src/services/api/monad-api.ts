export type InterestRates = { depositAPR: number; borrowAPR: number };
export type Deposit = { id: string; token: string; amount: number };
export type Borrow = { id: string; token: string; amount: number };
export type PaymentSchedule = { dueDates: string[]; amount: number };
export type CollateralInfo = { token: string; amount: number };

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const MonadAPI = {
  async getProtocolStats() {
    await delay(300);
    return {
      totalValueLocked: 12345678,
      totalBorrowed: 2345678,
      availableLiquidity: 9876543,
      interestRates: { depositAPR: 5.2, borrowAPR: 9.8 } as InterestRates,
    };
  },
  async getUserPositions(userId: string) {
    await delay(200);
    return {
      deposits: [] as Deposit[],
      borrows: [] as Borrow[],
      collateralRatio: 0,
      healthFactor: 0,
    };
  },
  async deposit(token: string, amount: number) {
    await delay(500);
    return { transactionHash: '0xDEMO', depositId: 'dep_1', interestRate: 5.2 };
  },
  async borrow(token: string, amount: number, collateral: CollateralInfo) {
    await delay(700);
    return { transactionHash: '0xDEMO', loanId: 'loan_1', interestRate: 9.8, repaymentSchedule: { dueDates: [], amount: 0 } as PaymentSchedule };
  },
  async getLiquidationRisk(userId: string) {
    await delay(200);
    return { riskLevel: 'LOW', liquidationPrice: 0, healthFactor: 0, recommendations: [] } as any;
  },
}; 