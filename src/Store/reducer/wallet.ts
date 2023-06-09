import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { can_buy, can_sell } from '../../utils';
import { ICoinValue } from './market';

export interface IWalletState {
    debt: number,
    assets: {
        [coinName: string]: number
    },
    total_space: number,
    cash: number
}

const USD_INIT_DEBT = 42

const initialState: IWalletState = {
    debt: USD_INIT_DEBT,
    assets: {
    },
    total_space: 420,
    cash: USD_INIT_DEBT
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState: initialState,
    reducers: {
        wallet_buy: (state, data: PayloadAction<{ coin: ICoinValue, quantity: number }>) => {
            const { coin, quantity } = data.payload;

            if (!quantity) {
                return;
            }

            if (can_buy(coin, quantity, state)) {
                state.cash -= coin.value * quantity;

                state.assets[coin.name] = state.assets[coin.name] || 0;
                state.assets[coin.name] += quantity;
            }
        },
        wallet_sell: (state, data: PayloadAction<{ coin: ICoinValue, quantity: number }>) => {
            const { coin, quantity } = data.payload;

            if (can_sell(coin, quantity, state)) {
                state.cash += coin.value * quantity;
                state.assets[coin.name] -= quantity;
            }
        },
        wallet_borrow: (state, data: PayloadAction<{ quantity: number }>) => {
            const { quantity } = data.payload;

            state.cash += quantity;
            state.debt += quantity;
        },
        wallet_repay: (state, data: PayloadAction<{ quantity: number }>) => {
            let { quantity } = data.payload;

            if (state.cash >= quantity) {
                if (state.debt < quantity) {
                    quantity = state.debt
                }
                state.cash -= quantity;
                state.debt -= quantity;
            }
        }
    }
})

export const { wallet_buy, wallet_sell, wallet_borrow, wallet_repay } = walletSlice.actions;

export default walletSlice.reducer