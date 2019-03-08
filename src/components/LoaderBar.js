import React, { Component } from 'react'
import {Tooltip} from 'react-tippy';

/**
 * { Class for not found(404) component. }
 *
 * @class      NotFound (name)
 */
export default class LoaderBar extends Component {

    componentDidMount() {
        this._initLoaderBar()
    }

    componentWillUnmount() {
        this.loaderBarInterval && clearInterval(this.loaderBarInterval)
    }


    _initLoaderBar(){
        const loadingSpanList = document.getElementsByClassName("loading"),
              steps        = 20,     // length of bar
              speed        = 50;     // #ms

        let c = 0,
            p = Promise.resolve(),
            i = 0;

        this.loaderBarInterval = setInterval(() => {
            parseInt(i/steps) % 2 == 0 
                        ? c++
                        : c--;
            drawLoader(c);
            i++;
        }, speed);

        function drawLoader(i, resolve){
            const loadArray = new Array(steps + 5).fill("-")
            loadArray[0]          = "[";
            loadArray[steps + 4]  = "]";
            loadArray[i+1]        = "="
            loadArray[i+2]        = "="
            loadArray[i+3]        = "="
            Array.from(loadingSpanList)
            .forEach(item => item.textContent = loadArray.join(""));
         }
    }

    render = () => <span id="loading" className="loading"></span>;
}