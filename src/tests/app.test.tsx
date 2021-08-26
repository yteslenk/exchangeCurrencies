import App from "../App";
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17'
import {Currencies} from "../types";

Enzyme.configure({adapter: new EnzymeAdapter()})

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve( {rates: {[Currencies.USD]: 1}}),
    }) as Promise<Response>
);

describe('App', () => {
    let wrapperApp: ReturnType<typeof shallow>;

    beforeEach(() => {
        wrapperApp = shallow(<App />);
    })

    afterEach(() => {
        wrapperApp.unmount();
    })

    it('exchangeMode information is displayed', () => {
        wrapperApp.setState({firstCurrency: Currencies.USD})

        expect(wrapperApp.find('#exchange-mode').text()).toEqual(`SELL ${Currencies.USD}`)
    })

    it('correlation label is displayed', () => {
        wrapperApp.setState({
            firstCurrency: Currencies.USD,
            secondCurrency: Currencies.EUR,
            rates: {
                [Currencies.USD]: 1,
                [Currencies.EUR]: 0.85
            }
        })

        expect(wrapperApp.find('#correlation').text()).toEqual('1 USD = 0.85 EUR')
    })
});
