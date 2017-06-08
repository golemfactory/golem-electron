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
        }, 5000)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    /**
     * [initSeaDragon func. inits OpenSeaDragon object to pan, zoom image]
     * @return nothing
     */
    initSeaDragon() {
        let {id, image, type} = this.props
        loadImage(image).then(data => {
            viewer = this.viewer = OpenSeadragon({
                id: id,
                visibilityRatio: 1.0,
                constrainDuringPan: false,
                defaultZoomLevel: 1,
                minZoomLevel: 1,
                maxZoomLevel: 10,
                zoomInButton: 'zoom-in',
                zoomOutButton: 'zoom-out',
                homeButton: 'reset',
                //fullPageButton: 'full-page',
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
                this.calculateZoomRatio.call(this, item.zoom)
            })

        });


    }


    calculateZoomRatio(zoom) {
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
