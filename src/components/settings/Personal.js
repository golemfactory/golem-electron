import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

import RadialProgress from './../RadialProgress'
import PlaceHolderAvatar from './../../assets/img/avatar.svg'

const mapStateToProps = state => ({
    charts: state.profile.charts,
    avatar: state.profile.avatar,
    nodeName: state.profile.nodeName,
    nodeId: state.info.networkInfo.key
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Personal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {avatar, charts, nodeName, nodeId} = this.props
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
                    <span className="user-name__personal">{nodeName ? nodeName : 'Anonymous Golem'}</span>
                    <p/><   span className="user-id__personal">{ nodeId ? nodeId.replace(new RegExp("^(.{0,4}).*(.{4})$", "im"), "$1...$2") : ' will be here'}</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Personal)