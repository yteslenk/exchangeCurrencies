import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import {Button, Grid, Header, Label} from 'semantic-ui-react'
import {CurrencyBlock} from "./CurrencyBlock";
import {DropdownProps} from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import {InputOnChangeData} from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import {ActionsWithBalance, ArrowPosition, Currencies, ExchangeMode, IAppState} from "./types";
import {BALANCE, INTERVAL} from "./constants";
import {fetchRates} from "./api";

export default class App extends React.Component<{}, IAppState>{
    state: IAppState = {
        isArrowUp: false,
        firstCurrency: null,
        secondCurrency: null,
        firstInput: '',
        secondInput: '',
        correlation: 1,
        rates: {
            [Currencies.USD]: 0,
            [Currencies.GBP]: 0,
            [Currencies.EUR]: 0,
        }
    }

    private intervalId?: number = undefined;

    componentDidMount() {
        this.fetchRates();
        this.intervalId = window.setInterval(this.fetchRates, INTERVAL);
    }

    fetchRates = () => {
        fetchRates()
            .then((rates) => this.setState({rates: rates}))
            .catch((err:Error) => console.log(err, "ERROR"));
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    componentDidUpdate(props: {}, prevState: Readonly<IAppState>) {
        const {firstCurrency: prevFirst, secondCurrency: prevSecond} = prevState;
        const {firstCurrency, secondCurrency} = this.state;

        if (firstCurrency && secondCurrency) {
            if (prevFirst !== firstCurrency || prevSecond !== secondCurrency) {
                this.setState({
                    correlation: this.calculateCurrenciesCorrelation(),
                    firstInput: '',
                    secondInput: ''
                })
            }
        }
    }

    getCorrelation = (firstCurrency: Currencies, secondCurrency: Currencies) =>
        this.state.rates[firstCurrency] / this.state.rates[secondCurrency];

    calculateAnotherInputValue = (value: number, currentInputPosition: string) => {
        const {firstCurrency, secondCurrency} = this.state;
        const lookedInputPosition = currentInputPosition === 'firstInput' ? 'secondInput' : 'firstInput';
        let calculatedCorrelation = 1;

        if (firstCurrency && secondCurrency) {
            calculatedCorrelation = currentInputPosition === 'firstInput'
                ? this.getCorrelation(secondCurrency, firstCurrency)
                : this.getCorrelation(firstCurrency, secondCurrency)
        }

        const formattedValue = value > 0 ? (value * Number(calculatedCorrelation)).toFixed(2) : '';
        this.setState((prevState: IAppState) => ({...prevState, [lookedInputPosition]: formattedValue}));
    }

    handleOnChangeCurrency = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps, currencyPosition: string) =>
        this.setState((prevState: IAppState) => ({...prevState, [currencyPosition]: data.value}));

    handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData, inputPosition: string) => {
        this.calculateAnotherInputValue((Number(data.value)), inputPosition);
        this.setState((prevState: IAppState) => ({...prevState, [inputPosition]: data.value}));
    }

    handleOnchangeArrowPosition = () =>
        this.setState({isArrowUp: !this.state.isArrowUp})

    calculateCurrenciesCorrelation = () => {
        const {firstCurrency, secondCurrency} = this.state;
        if (firstCurrency && secondCurrency) {
            return Number(this.getCorrelation(secondCurrency, firstCurrency).toFixed(4))
        }
        return 1;
    }

    renderCurrencyCorrelation = () => {
        const {firstCurrency, secondCurrency, correlation} = this.state;
        return correlation && `1 ${firstCurrency} = ${correlation} ${secondCurrency}`;
    }

    render () {
        const {isArrowUp, firstCurrency, secondCurrency, firstInput, secondInput} = this.state;
        const activeMode = isArrowUp ? ArrowPosition.UP : ArrowPosition.DOWN;
        const arrowDirection = isArrowUp ? <span>&uarr;</span> : <span>&darr;</span>

        return (
            <div>
                <Grid textAlign='center'>
                    <Grid.Column style={{maxWidth: 600, marginTop: 10}}>
                        <Header>EXCHANGE CURRENCY</Header>

                        <Grid container columns={3} stackable>
                            <Grid.Column style={{textAlign: "left"}}>
                                {
                                    firstCurrency &&
                                    <Label>
                                        <span id='exchange-mode'>
                                        {
                                            activeMode === ArrowPosition.UP
                                                ? `${ExchangeMode.BUY} ${firstCurrency}`
                                                : `${ExchangeMode.SELL} ${firstCurrency}`
                                        }
                                        </span>
                                    </Label>
                                }
                            </Grid.Column>

                            <Grid.Column style={{textAlign: "center"}}>
                                {
                                    firstCurrency && secondCurrency &&
                                    <Label>
                                        <span id="correlation">{this.renderCurrencyCorrelation()}</span>
                                    </Label>
                                }
                            </Grid.Column>

                            <Grid.Column style={{textAlign: "right"}}>
                                <Button color='green' onClick={this.handleOnchangeArrowPosition}>{arrowDirection}</Button>
                            </Grid.Column>
                        </Grid>

                        <div className="ui column grid">
                            <div className="stretched row">
                                <div className="column">
                                    <CurrencyBlock
                                        balance={BALANCE}
                                        mode={isArrowUp ? ActionsWithBalance.ADD : ActionsWithBalance.SUBTRACT}
                                        selectCurrency={(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) =>
                                            this.handleOnChangeCurrency(event, data, 'firstCurrency')}
                                        selectedCurrency={firstCurrency}
                                        inputValue={firstInput}
                                        inputOnChangeHandler={(event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) =>
                                            this.handleOnChangeInput(event, data, 'firstInput')}
                                    />

                                    <CurrencyBlock
                                        balance={BALANCE}
                                        mode={isArrowUp ? ActionsWithBalance.SUBTRACT : ActionsWithBalance.ADD}
                                        selectCurrency={(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) =>
                                            this.handleOnChangeCurrency(event, data, 'secondCurrency')}
                                        selectedCurrency={secondCurrency}
                                        inputValue={secondInput}
                                        inputOnChangeHandler={(event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) =>
                                            this.handleOnChangeInput(event, data, 'secondInput')}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}
