import React from 'react';
import d3 from 'd3';
import {connect} from 'react-redux';
import {calcDownpayment, calcMonthlyPITI, calcFrontendDTI} from '../calculations/piti';
import * as actionCreators from '../actions/mortgageActions';
import '../../styles/CalcPITI.scss';

import {ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';

import Chart from '../components/Chart';
import Form from '../components/Form';

const currencyFormat = d3.format('$,');
const percentFormat = d3.format(',%');

export const CalcPITI = React.createClass({

  calculateData () {
    const {homePrice, rates, householdIncome, products} = this.props;
    const calcMonthlyPITIBound = calcMonthlyPITI.bind(null, homePrice, rates);
    const calcDownpaymentBound = calcDownpayment.bind(null, homePrice);
    const calcFrontendDTIBound = calcFrontendDTI.bind(null, homePrice, rates, householdIncome);
    return products.map((product) => {
      return {
        x: product.name,
        y: calcMonthlyPITIBound(product),
        frontendDTI: calcFrontendDTIBound(product),
        downPayment: calcDownpaymentBound(product)
      };
    });
  },

  render () {
    const buttonStyle = {
      borderRadius: '0px',
      fontFamily: 'Lato',
      textTransform: 'uppercase'
    };
    return (
      <div>
        <h3>PITI and Cash Required</h3>
        <hr />
        <div className="row">
          <div id="user-input" className="col-md-3">
            <Form {...this.props} />
          </div>
          <div className="col-md-9 text-center">
            <ButtonToolbar style={{paddingLeft: '40%'}}>
              <ButtonGroup bsSize="large">
                <Button style={buttonStyle}>Madlib</Button>
                <Button style={buttonStyle}>Chart</Button>
              </ButtonGroup>
            </ButtonToolbar>
            <Chart
              data={this.calculateData()}
              title={""}
              yAxisLabel={"Monthly PITI"}
              labelFormatter={(val) => currencyFormat(Math.round(val))}
            />
          </div>
        </div>
      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    ...state.pitiCalculator
  };
}

export default connect(
  mapStateToProps,
  actionCreators
)(CalcPITI);
