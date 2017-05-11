import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

const mapStateToProps = state => ({
    providerMinPrice: state.price.providerMinPrice,
    requestorMaxPrice: state.price.requestorMaxPrice
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class Price extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {providerMinPrice, requestorMaxPrice} = this.props
        return (
            <div className="content__price">
                <div className="section__price">
                    <span>Provider Minimum</span>
                    <input type="number" disabled value={providerMinPrice} aria-label="Provider minimum price"/>
                    <span>USD per hour</span>
                </div>
                <div className="section__price">
                    <span>Requestor Maximum</span>
                    <input type="number" disabled value={requestorMaxPrice} aria-label="Requestor maximum price"/>
                    <span>USD per hour</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Price)