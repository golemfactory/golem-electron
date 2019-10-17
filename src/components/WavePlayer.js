import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js';
//'https://freewavesamples.com/files/Yamaha-V50-Industrial-Beat-120bpm.wav'
/**
 * { Class for creating tutorials with pointing objects. }
 *
 * @class      SpotLight (name)
 */
export default class WavePlayer extends Component {
    state = {
        playPause: false,
        stop: false,
        isReady: false
    };

    componentDidMount() {
        // Create an instance of wave surfer with its configuration
        this.Spectrum = WaveSurfer.create({
            container: '#audio-spectrum',
            progressColor: '#03a9f4',
            height: '90',
            scrollParent: false,
            barWidth: 1,
            plugins: [
                TimelinePlugin.create({
                    container: '#wave-timeline',
                    height: 10
                }),
                CursorPlugin.create({
                    showTime: true,
                    customStyle: {
                        cursor: 'pointer'
                    },
                    customShowTimeStyle: {
                        marginLeft: '5px',
                        marginRight: '5px',
                        fontWeight: 500,
                        fontSize: '10pt',
                        color: 'black',
                        margin: 0
                    }
                })
            ]
        });

        // Add a listener to enable the play button once it's ready
        this.Spectrum.on('ready', () => {
            this.setState({ isReady: true });
        });

        this.Spectrum.on('finish', () => this.stop());

        this.Spectrum.on('seek', duration => {
            if (!this.Spectrum.isPlaying() && duration > 0) {
                this.Spectrum.play();
                this.setState({
                    playPause: true
                })
            }
        });
        this.Spectrum.load(this.props.source);
    }

    togglePlay = e => {
        e.target.classList.toggle('pause');
        this.setState(
            prevState => ({
                playPause: !prevState.playPause,
                stop: prevState.playPause
            }),
            () => {
                if (this.state.playPause) {
                    this.Spectrum.play();
                } else {
                    this.Spectrum.pause();
                }
            }
        );
    };

    stop = () => {
        this.setState(
            prevState => ({ playPause: false, stop: false }),
            () => {
                this.Spectrum.stop();
            }
        );
    };

    render() {
        const { isReady, playPause, stop } = this.state;
        return (
            <div className="wave-player">
                <div id="audio-spectrum">
                    {!isReady && (
                        <span className="loading-spectrum">
                            Generating spectrum...
                        </span>
                    )}
                </div>
                <div id="wave-timeline" />
                <div className="grid--media">
                    <button
                        className="btn btn--primary"
                        onClick={this.togglePlay}>
                        {!playPause ? 'Play' : 'Pause'}
                    </button>
                    <button className="btn btn--primary" onClick={this.stop}>
                        Stop
                    </button>
                </div>
            </div>
        );
    }
}
