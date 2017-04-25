import React from 'react';

import Personal from './Personal'
import Performance from './Performance'
import Price from './Price'
import Trust from './Trust'
import FileLocation from './FileLocation'
import { APP_VERSION } from './../../main'


const accordionItems = [
    {
        title: 'Performance',
        content: <Performance/>
    },
    {
        title: 'Price',
        content: <Price/>
    },
    {
        title: 'Network Trust',
        content: <Trust/>
    },
    {
        title: 'Default File Location',
        content: <FileLocation/>
    }
]

let activateContent

export default class index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeContent: undefined
        }
    }

    _handleTab(elm, evt) {
        let target = elm.target
        let targetRoot = target.parentElement.parentElement
        let index = targetRoot.getAttribute('value')
        let accordionItems = document.getElementsByClassName('item__accordion')
        for (var i = 0; i < accordionItems.length; i++) {
            if (i !== parseInt(index)) {
                accordionItems[i].classList.remove('active')
                accordionItems[i].children[0].children[1].classList.remove('icon-arrow-up')
                accordionItems[i].children[0].children[1].classList.add('icon-arrow-down')
            }
        }
        targetRoot.classList.toggle('active')
        target.classList.toggle('icon-arrow-down')
        target.classList.toggle('icon-arrow-up')
        this.setState({
            activeContent: this.state.activeContent !== parseInt(index) ? parseInt(index) : undefined
        })
    }

    loadAccordionMenu(data) {
        return data.map((item, index) => <div className="item__accordion" key={index.toString()} value={index}>
                        <div className="item-title__accordion">
                            <span>{item.title}</span>
                            <span className="icon-arrow-down" onClick={::this._handleTab} role="tab" tabIndex="0" aria-label="Expand Tab"/>
                        </div>
                        <div className="item-content__accordion" role="tabpanel">
                        {this.state.activeContent === index && item.content}
                        </div>
                    </div>)
    }

    render() {
        return (
            <div className="content__settings">
                <Personal/>
                <div className="tab__accordion">
                    { this.loadAccordionMenu(accordionItems)}
                </div>
                <div className="footer__settings">
                    <span>Brass Golem {APP_VERSION}</span>
                </div>
            </div>
        );
    }
}
