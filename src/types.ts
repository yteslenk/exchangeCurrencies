import React from "react";
import {DropdownProps} from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import {InputOnChangeData} from "semantic-ui-react/dist/commonjs/elements/Input/Input";

export enum ExchangeMode {
    BUY = 'BUY',
    SELL = 'SELL',
}

export enum ArrowPosition {
    UP = 'UP',
    DOWN = 'DOWN'
}

export type Rates = {[index in Currencies]: number};

export interface IAppState {
    isArrowUp: boolean,
    firstCurrency: Currencies | null,
    secondCurrency:  Currencies | null,
    firstInput: string,
    secondInput: string,
    correlation: number,
    rates: Rates,
}

export enum ActionsWithBalance {
    ADD ='ADD',
    SUBTRACT = 'SUBTRACT',
}

export interface ICurrencyBlockProps {
    balance: {[key: string]: number},
    mode: ActionsWithBalance,
    selectCurrency: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void,
    selectedCurrency: Currencies | null,
    inputValue: string,
    inputOnChangeHandler: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void,
}

export interface ICurrencyBlockState {
    inputError: boolean
}

export enum Currencies {
    USD ='USD',
    EUR = 'EUR',
    GBP = 'GBP',
}