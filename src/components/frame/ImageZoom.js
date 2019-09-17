import React from 'react';
/**
 * @see http://openseadragon.github.io/docs/
 */
import OpenSeaDragon from 'openseadragon';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';

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
let loadImage = src =>
    new Promise(function(resolve, reject) {
        var img = document.createElement('img');
        img.addEventListener('load', function() {
            imageInfo.width = img.naturalWidth;
            imageInfo.height = img.naturalHeight;
            resolve(img);
        });
        img.addEventListener('error', function(err) {
            reject(404);
        });
        img.src = src;
    });

const mapStateToProps = state => ({
    zoomRatio: state.input.zoomRatio,
    isLoaderActive: state.loader.FRAME_LOADER.isLoading
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class ImageZoom extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.initSeaDragon(OpenSeaDragon);
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.isSubtaskShown !== this.props.isSubtaskShown &&
            !!nextProps.isSubtaskShown
        ) {
            this.viewer.viewport.goHome(true);
        }

        if (
            nextProps.details.progress !== this.props.details.progress ||
            nextProps.details.status !== this.props.details.status
        ) {
            loadImage(nextProps.image).then(data => {
                this.viewer.world.removeItem(
                    this.viewer.world.getItemAt(0)
                );
                this.viewer.addTiledImage({
                    tileSource: {
                        type: nextProps.type,
                        levels: [
                            {
                                url: nextProps.image,
                                height: data.naturalHeight,
                                width: data.naturalWidth
                            }
                        ]
                    },
                });
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.image !== this.props.image) return true;
        return false;
    }

    /**
     * [initSeaDragon func. inits OpenSeaDragon object to pan, zoom image]
     */
    initSeaDragon(OSD) {
        let { id, image, type } = this.props;
        loadImage(image).then(data => {
            let isVertical = false;

            //console.log("imageInfo.width/imageInfo.height", imageInfo.width / imageInfo.height);
            if (imageInfo.width / imageInfo.height < 1.4601941747572815) {
                isVertical = true;
            }
            viewer = this.viewer = OSD({
                id: id,
                //visibilityRatio: 1,
                constrainDuringPan: false,
                //defaultZoomLevel: 1,
                minZoomLevel: !isVertical ? 1 : 0.1,
                maxZoomLevel: 10,
                zoomInButton: 'zoom-in',
                zoomOutButton: 'zoom-out',
                homeButton: 'reset',
                allowZoomToConstraintsOnResize: true,
                //fullPageButton: 'full-page',
                //wrapVertical: isVertical, <-- be careful while using this feature. cause of repeated image issue for higher than 35:24 ratio
                nextButton: 'next',
                previousButton: 'previous',
                showNavigator: false,
                tileSources: {
                    type: type,
                    levels: [
                        {
                            url: image,
                            height: data.naturalHeight,
                            width: data.naturalWidth
                        }
                    ]
                },
                gestureSettingsMouse: {
                    clickToZoom: false,
                    dblClickToZoom: true
                }
            });

            viewer.addHandler('open', item => {
                setTimeout(
                    () => {
                        this.viewer.viewport.goHome(true);
                        this.props.fetchClientInfo(
                            this.viewer.viewport._containerInnerSize,
                            this.viewer.viewport.getCenter(true),
                            this.viewer.viewport
                        );
                    },
                    this.props.isLoaderActive ? 5000 : 0
                );
            });

            viewer.addHandler('resize', item => {
                setTimeout(() => {
                    this.viewer.viewport.goHome(true);
                    this.props.fetchClientInfo(
                        this.viewer.viewport._containerInnerSize,
                        this.viewer.viewport.getCenter(true),
                        this.viewer.viewport
                    );
                }, 500); //MacOS maximize animation delay
            });

            viewer.addHandler('zoom', (item) => {
                !!this.props.isSubtaskShown && this.props.getSubtasksBorder()
                this.calculateZoomRatio.call(this, item.zoom)
            })
        });
    }

    /**
     * [calculateZoomRatio funcs. observe zoom changes and updates zoom ratio for the control panel indicator]
     * @param  {Number} zoom [Zoom level of the Image Viewer]
     */
    calculateZoomRatio(zoom) {
        const { x, y } = viewer.viewport.getContainerSize();
        const { width, height } = imageInfo;
        let ratio = (x / width) * 100;
        // if ((width / height) < 1.4601941747572815) {
        //     ratio = (y / height) * 100
        // }
        this.props.actions.setZoomRatio(ratio * zoom);
    }

    render() {
        let { id } = this.props;
        return (
            <div
                className="ocd-div"
                id="ocdDiv"
                ref={node => {
                    this.el = node;
                }}>
                <div className="openseadragon" id={id} />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageZoom);

ImageZoom.defaultProps = {
    id: 'ocd-viewer',
    type: 'legacy-image-pyramid'
};
