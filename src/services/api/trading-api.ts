export type QuoteRequest = { sellToken: string; buyToken: string; amount: number };

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const ZeroXAPI = {
  async getQuote(order: QuoteRequest) {
    await delay(200);
    return {
      price: 1.0,
      guaranteedPrice: 0.99,
      to: '0xRouter',
      data: '0x...',
      value: 0,
      gas: 100000,
      estimatedGas: 100000,
      protocolFee: 0,
      minimumProtocolFee: 0,
      buyTokenAddress: '0xBUY',
      sellTokenAddress: '0xSELL',
      buyAmount: order.amount,
      sellAmount: order.amount,
      sources: [],
      orders: [],
      allowanceTarget: '0xALLOW',
      decodedUniqueId: 'demo',
      sellTokenToEthRate: 1,
      buyTokenToEthRate: 1,
      estimatedPriceImpact: 0.1,
      sourcesBreakdown: [],
    } as any;
  },
  async executeOrder(order: any) {
    await delay(400);
    return { transactionHash: '0xEXEC', success: true, gasUsed: 95000, blockNumber: 0 };
  },
  async getLiquiditySources() {
    await delay(150);
    return { sources: ['Uniswap', 'Sushi', 'Balancer'], totalLiquidity: 1000000 } as any;
  },
}; 