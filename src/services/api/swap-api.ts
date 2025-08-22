export type QuoteParams = { from: string; to: string; amount: number };

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const SwapAPI = {
  uniswap: {
    async getQuote(params: QuoteParams) {
      await delay(200);
      return { inputAmount: params.amount, outputAmount: params.amount * 0.99, priceImpact: 0.1, gasEstimate: 90000, route: [] } as any;
    },
    async executeSwap(quote: any) {
      await delay(400);
      return { transactionHash: '0xSWAP', success: true, outputAmount: quote.outputAmount };
    },
  },
  oneInch: {
    async getAggregatedQuote(params: QuoteParams) {
      await delay(250);
      return { fromToken: params.from, toToken: params.to, fromTokenAmount: params.amount, toTokenAmount: params.amount * 0.995, protocols: [], gas: 95000 } as any;
    },
    async executeAggregatedSwap(quote: any) {
      await delay(450);
      return { transactionHash: '0x1INCH', success: true };
    },
  },
  ramp: {
    async getRampProviders() { return ['MoonPay', 'Ramp', 'Transak']; },
  }
}; 