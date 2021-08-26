import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import {DropdownProps} from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import {AVAILABLE_CURRENCIES} from "./constants";
import {Currencies} from "./types";

const generateCurrencies = () => {
    return AVAILABLE_CURRENCIES.map(currency => ({
        key: Currencies[currency],
        text: Currencies[currency],
        value: Currencies[currency],
    }));
}

export const DropdownView = (
    props: {selectCurrency: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void }
) => (
    <Dropdown
        placeholder='Select Currency'
        inline
        options={generateCurrencies()}
        onChange={props.selectCurrency}
    />
)

