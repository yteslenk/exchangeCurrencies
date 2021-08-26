import React from 'react'
import {DropdownView} from "./Dropdown";
import {Grid, Input} from "semantic-ui-react";
import {ActionsWithBalance, ICurrencyBlockProps, ICurrencyBlockState} from "./types";

export class CurrencyBlock extends React.Component<ICurrencyBlockProps, ICurrencyBlockState>{
    state = {
        inputError: false
    }

    componentDidUpdate(prevProps: Readonly<ICurrencyBlockProps>) {
        if (
            prevProps.inputValue !== this.props.inputValue ||
            prevProps.selectedCurrency !== this.props.selectedCurrency ||
            prevProps.mode !== this.props.mode
        )
        this.checkIfBalanceHasEnough();
    };

    checkIfBalanceHasEnough = () => {
        const {inputValue, selectedCurrency, balance, mode} = this.props;
        const isSubtract = mode === ActionsWithBalance.SUBTRACT;

        if (!isSubtract) {
            this.setState({inputError: false})
        }

        if (Boolean(inputValue) && selectedCurrency && isSubtract) {
            this.setState({inputError: !(balance[selectedCurrency] > Number(inputValue))})
        }
    }

    render() {
        const {
            balance,
            mode,
            selectCurrency,
            selectedCurrency,
            inputValue,
            inputOnChangeHandler
        } = this.props;

        const {inputError} = this.state;
        const isSubtract = mode === ActionsWithBalance.SUBTRACT;

        return (
            <div style={{border: "1px solid black", marginTop: '10px', padding: '10px'}}>
                <Grid container columns={3} stackable>
                    <Grid.Column width={12} style={{textAlign: "left"}}>
                        <DropdownView selectCurrency={selectCurrency}/>
                        <div style={{marginTop: "10px"}}>
                            BALANCE: {selectedCurrency && balance[selectedCurrency]}
                        </div>
                    </Grid.Column>

                    <Grid.Column width={1} style={{textAlign: "right", marginTop: "15px", paddingRight: '0px'}}>
                        <span>{Boolean(inputValue) && (isSubtract ? '-' : '+')}</span>
                    </Grid.Column>

                    <Grid.Column
                        width={3}
                        style={{textAlign: "right", marginTop: "15px", paddingLeft: '0'}}>
                        <Input
                            fluid
                            transparent
                            placeholder={0}
                            onChange={inputOnChangeHandler}
                            value={inputValue}
                            error={inputError}
                        />
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}
