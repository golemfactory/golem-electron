import React from 'react';
/**
 * @see http://openseadragon.github.io/docs/ 
 */
import OpenSeaDragon from 'openseadragon';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../../actions'


//carrying viewer information to other components
export let viewer;
export let imageInfo = {
    width: null,
    height: null
};
/**
 * [helper function to load image using promises]
 * @param  {[Function]} resolve
 * @param  {[Function]} reject
 * @return nothing
 */
let loadImage = (src) => new Promise(function(resolve, reject) {
    var img = document.createElement('img')
    img.addEventListener('load', function() {
        imageInfo.width = img.naturalWidth
        imageInfo.height = img.naturalHeight
        resolve(img)
    })
    img.addEventListener('error', function(err) {
        reject(404)
    })
    img.src = src;
});

const mapStateToProps = state => ({
    zoomRatio: state.input.zoomRatio
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class ImageZoom extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.initSeaDragon()
        setTimeout(() => {
            this.viewer.viewport.getZoom()
            this.props.fetchClientInfo(this.viewer.viewport._containerInnerSize, this.viewer.viewport.getCenter(true), this.viewer.viewport);
        }, 5000)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    /**
     * [initSeaDragon func. inits OpenSeaDragon object to pan, zoom image]
     */
    initSeaDragon() {
        let {id, image, type} = this.props
        loadImage(image).then(data => {
            let isVertical = false

            console.log("imageInfo.width/imageInfo.height", imageInfo.width / imageInfo.height);
            if ((imageInfo.width / imageInfo.height) < 1.4601941747572815) {
                isVertical = true
            }
            viewer = this.viewer = OpenSeadragon({
                id: id,
                //visibilityRatio: 1,
                constrainDuringPan: false,
                //defaultZoomLevel: 1,
                minZoomLevel: !isVertical ? 1 : .00001,
                maxZoomLevel: 10,
                zoomInButton: 'zoom-in',
                zoomOutButton: 'zoom-out',
                homeButton: 'reset',
                //fullPageButton: 'full-page',
                wrapVertical: isVertical,
                nextButton: 'next',
                previousButton: 'previous',
                showNavigator: false,
                tileSources: {
                    type: type,
                    levels: [{
                        url: image,
                        height: data.naturalHeight,
                        width: data.naturalWidth
                    }]
                },
                gestureSettingsMouse: {
                    clickToZoom: false,
                    dblClickToZoom: true
                }
            })

            viewer.addHandler('zoom', (item) => {
                this.viewer.viewport.goHome(true)
                this.calculateZoomRatio.call(this, item.zoom)
            })

        });
    }

    /**
     * [calculateZoomRatio funcs. observe zoom changes and updates zoom ratio for the control panel indicator]
     * @param  {Number} zoom [Zoom level of the Image Viewer]
     */
    calculateZoomRatio(zoom) {
        const {x, y} = viewer.viewport.getContainerSize()
        const {width, height} = imageInfo
        let ratio = (x / width) * 100
        // if ((width / height) < 1.4601941747572815) {
        //     ratio = (y / height) * 100
        // }
        this.props.actions.setZoomRatio(ratio * zoom)

    }

    render() {
        let {id} = this.props
        return (
            <div className="ocd-div" id="ocdDiv" ref={node => {
                this.el = node;
            }}>
                <div className="openseadragon" id={id}></div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageZoom)

ImageZoom.defaultProps = {
    id: 'ocd-viewer',
    type: 'legacy-image-pyramid'
}
