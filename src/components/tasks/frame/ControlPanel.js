import React from 'react';
import { viewer, imageInfo } from './ImageZoom'

export default class ControlPanel extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            ratio: 0
        }
    }

    componentDidMount() {
        setTimeout(() => { // <-- TODO Need some trigger instead
            this.setState({
                ratio: this.calculateZoomRatio()
            })
        }, 500)
    }

    _handleUpdateZoomRatio() {
        this.setState({
            ratio: this.calculateZoomRatio()
        })
    }

    calculateZoomRatio() {
        const {x, y} = viewer.viewport.getContainerSize()
        const {width, height} = imageInfo
        let ratio = 0

        if (width > x) {
            ratio = (x / width) * 100
        } else if (height > y) {
            ratio = (y / height) * 100
        } else {
            ratio = (x / width) * 100
        }

        return ratio * viewer.viewport.getZoom()

    }

    render() {
        const {ratio} = this.state
        const {showSubtask, imgIndex} = this.props
        return (
            <div className="container__control-panel">
                <span className="icon-arrow-left-white"/>
                <span>{parseInt(imgIndex) + 1} of 250</span>
                <span className="icon-arrow-right-white"/>
                <span className="icon-zoom-out" id="zoom-out" onClick={::this._handleUpdateZoomRatio}/>
                <span id="reset" onClick={::this._handleUpdateZoomRatio}>{ratio.toFixed(2)}%</span>
                <span className="icon-zoom-in" id="zoom-in" onClick={::this._handleUpdateZoomRatio}/>
                <span className="icon-show-subtasks" onClick={showSubtask}/>
            </div>
        );
    }
}
