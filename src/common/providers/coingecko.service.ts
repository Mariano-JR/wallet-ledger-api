import { Injectable } from '@nestjs/common';
import { Tokens } from '../enums/token.enum.js';
import { AppError } from '../errors/app.error.js';

interface CoinGeckoDataResponse {
  [coinId: string]: {
    [currency: string]: number;
  };
}

const tokenMap = {
  BRL: {
    id: 'brazilian-real',
    symbol: 'brl',
  },
  BTC: {
    id: 'bitcoin',
    symbol: 'btc',
  },
  ETH: {
    id: 'ethereum',
    symbol: 'eth',
  },
};

@Injectable()
export class CoingeckoService {
  async getPrice(tokenIn: Tokens, tokenOut: Tokens): Promise<number> {
    const coinIn = tokenMap[tokenIn];
    const coinOut = tokenMap[tokenOut];

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinOut.id}&vs_currencies=${coinIn.symbol}&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`,
    );

    if (!response.ok) {
      throw new AppError('Falha ao buscar preço no Coingecko', 400);
    }

    const data = (await response.json()) as CoinGeckoDataResponse;
    return data[coinOut.id][coinIn.symbol];
  }
}
