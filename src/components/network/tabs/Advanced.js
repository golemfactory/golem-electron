import React from 'react';
import RadialProgress from './../../RadialProgress'

export default class Advanced extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="content__advanced">
            <div className="quick-settings__advanced">
              <div className="select">
                <select >
                 <option>Custom</option>
                </select>
              </div>
              <button className="btn--outline">Save as Preset</button>
            </div>
            <div className="section__radial-options">
              <div className="item__radial-options">
                <RadialProgress/>
                <input type="number"/>
              </div>
              <div className="item__radial-options">
                <RadialProgress/>
                <input type="number"/>
              </div>
              <div className="item__radial-options">
                <RadialProgress/>
                <input type="number"/>
              </div>
            </div>
            <div className="advanced__tips">
              <span>Allocate your machine’s resources exactly as you like. Remember that if you give Golem all of your processing power you will not be  able to use it at the same time.</span>
            </div>
          </div>
        );
    }
}
