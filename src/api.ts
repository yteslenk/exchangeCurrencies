import {AVAILABLE_CURRENCIES} from "./constants";
import type { Rates } from "./types";

export const fetchRates = async () => {
    const res = await fetch('https://openexchangerates.org/api/latest.json?app_id=2f2f19f0a4c044578692d2bbe060d8f1');
    const data = await res.json();

    return AVAILABLE_CURRENCIES.reduce((acc, currency) => {
        return {
            ...acc,
            [currency]: data.rates[currency],
        };
    }, {} as Rates);
}