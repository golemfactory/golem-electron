import React from 'react';
import { browserHistory } from 'react-router'

import ControlPanel from './ControlPanel'
import OpenSeaDragon from './ImageZoom'

const path = [
    [
        [1, 1],
        [1, 149],
        [99, 149],
        [99, 74],
        [751, 74],
        [751, 1],
        [1, 1]
    ],
    [
        [1, 151],
        [1, 299],
        [751, 299],
        [751, 76],
        [101, 76],
        [101, 151],
        [1, 151]
    ],
    [
        [1, 301],
        [1, 390],
        [199, 390],
        [199, 301],
        [1, 301]
    ],
    [
        [201, 301],
        [201, 390],
        [399, 390],
        [399, 301],
        [201, 301]
    ],
    [
        [401, 301],
        [401, 390],
        [751, 390],
        [751, 301],
        [401, 301]
    ]
]

let tmpIndex = 0

function CanvasCreator(canvas, width, height) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.id = 'mainEditor';

    // Draw something
    var ctx = this.canvas.getContext('2d');
    ctx.fillStyle = "#A0EBDD"
    ctx.fillRect(30, 30, 150, 150);
}

export default class Single extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSubtaskShown: false
        }
        this.updateDimensions = ::this.updateDimensions
        this._showSubtask = ::this._showSubtask
    }

    /**
     * { The function updating dimensions of the canvas which is shown on frame component while resizing the window}
     */
    updateDimensions() {
        let canvas = this.refs.frameCanvas;
        let imageContainer = this.refs.containerImage;

        if ((canvas && imageContainer) && (canvas.offsetWidth !== imageContainer.offsetWidth)) {
            canvas.style.width = imageContainer.offsetWidth - 3;
        }

        if ((canvas && imageContainer) && (canvas.offsetHeight !== imageContainer.offsetHeight)) {
            canvas.style.height = imageContainer.offsetHeight - 3;
        }
    }

    componentWillMount() {
        //this.updateDimensions();
    }

    componentDidMount() {
        console.log(this.props.id)
        // this.path = this.props.path || path
        // this.path.forEach((item, index) => {
        //     if (index === 0)
        //         this.draw(item, true)
        //     this.draw(item)
        // })
        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions()
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    /**
     * { draw function drawing border of the given paths on the canvas }
     * 
     * @param  {Array} subPath
     * @param  {Boolean} beginning
     * @param  {String} color
     */
    draw(subPath, beginning = false, color = "rgba(255,255,255,0.2)") {
        this.canvas = this.refs.frameCanvas
        this.canvasContext = this.canvas.getContext('2d')
        if (this.canvasContext) {
            var ctx = this.canvasContext
            if (beginning)
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.beginPath();
            ctx.moveTo(subPath[0][0], subPath[0][1]);

            subPath.forEach((item, index) => {
                if (index > 0)
                    ctx.lineTo(item[0], item[1]);
            })
            ctx.strokeStyle = color
            ctx.lineWidth = 1
            ctx.stroke();
            ctx.closePath();
        }
        return true
    }

    /**
     * {overCanvas making hover effect for the canvas when mouse over part of it}
     * 
     * @param  {Object}   event   { mouse event }
     */
    overCanvas(event) {
        if (this.state.isSubtaskShown) {
            let ratioX = event.currentTarget.offsetWidth / event.currentTarget.width
            let ratioY = event.currentTarget.offsetHeight / event.currentTarget.height
            let selectedIndex = this.pointIn([(event.nativeEvent.offsetX) / ratioX, (event.nativeEvent.offsetY) / ratioY], this.path)

            if (selectedIndex > -1 && tmpIndex != selectedIndex) {
                tmpIndex = selectedIndex
                this.path.forEach((item, index) => {
                    if (index === 0) {
                        this.draw(item, true)
                    }
                    if (index === selectedIndex) {
                        this.draw(item, !index ? true : false, "red")
                    } else {
                        this.draw(item)
                    }
                })
            }
            if (selectedIndex < 0) {
                tmpIndex = selectedIndex
                this.path.forEach((item, index) => {
                    if (index === 0)
                        this.draw(item, true)
                    this.draw(item)
                })
            }
        }
    }

    /**
     * { pointIn function checking whether mouse into the given shape or not if it is returning index of the specific shape }
     * 
     * @param  {Array}  point  { coordinate of mouse as [x, y] }
     * @param  {Array}  vs     { Given path array from the canvas }
     * @return {Number} 
     *
     * 
     *  ray-casting algorithm based on
     *  http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
     *  https://github.com/substack/point-in-polygon
     */
    pointIn(point, vs) {

        var x = point[0],
            y = point[1];

        var inside = Array(vs.length).fill(false)

        vs.forEach((item, index) => {
            for (var i = 0, j = item.length - 1; i < item.length; j = i++) {
                var xi = item[i][0],
                    yi = item[i][1];
                var xj = item[j][0],
                    yj = item[j][1];
                var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect)
                    inside[index] = !inside[index];
            }
        })
        return inside.indexOf(true);
    }

    /**
     * [_showSubtask func. will draw canvas paths over the image to show subtask of render.]
     * @return  nothing
     */
    _showSubtask() {
        this.setState({
            isSubtaskShown: !this.state.isSubtaskShown
        }, () => {
            if (this.state.isSubtaskShown) {
                console.log('drawing!')
                this.path = this.props.path || path
                this.path.forEach((item, index) => {
                    if (index === 0)
                        this.draw(item, true)
                    this.draw(item)
                })
            } else {
                this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        })

    }

    /**
     * [_handleClose function for close single frame componenet]
     * @return nothing
     */
    _handleClose() {
        browserHistory.push('/preview/complete')
    }

    render() {
        const {isSubtaskShown} = this.state
        const {id, preview, actions} = this.props
        return (
            <div className="section__frame">
                <span className="button__subtask" onClick={::this._handleClose}><span className="icon-cross"/></span>
                <div className="section__image" ref="containerImage">
                    <OpenSeaDragon image="http://i.amz.mshcdn.com/7j6AkcDAU6D0RIsbIZVI7boC8Kw=/1200x627/2013%2F05%2F09%2Fdb%2FTeslaModelS.66c4e.jpg" />
                    {isSubtaskShown && <canvas id="frameCanvas" ref="frameCanvas" width="752" height="392" onMouseMove={::this.overCanvas}></canvas>}
                </div>
                <ControlPanel showSubtask={this._showSubtask} imgIndex={id}/>
            </div>
        );
    }
}
