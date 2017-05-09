import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

import RadialProgress from './../RadialProgress'
import PlaceHolderAvatar from './../../assets/img/avatar.svg'

const mapStateToProps = state => ({
    charts: state.profile.charts,
    avatar: state.profile.avatar
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Personal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {avatar, charts} = this.props
        return (
            <div className="section__personal">
                <div className="indicator-panel__personal">
                    <div className="indicator__personal">
                        <RadialProgress pct={charts.requestor}/>
                        <span>Requestor</span>
                        <p/><span className="icon-question-mark"/>
                    </div>
                    <div>
                        <img className="image__personal" src={avatar || PlaceHolderAvatar} alt="avatar"/>
                    </div>
                    <div className="indicator__personal">
                        <RadialProgress pct={charts.provider}/>
                        <span>Provider</span>
                    </div>
                </div>
                <div>
                    <span className="user-name__personal">Muhammed Tanrıkulu</span>
                    <p/><span className="user-id__personal"> a34a…3bb2</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Personal)