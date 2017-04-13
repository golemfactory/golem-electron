import React from 'react';


const mockList = [
    {
        icon: 'icon-macbook',
        title: 'i5-6267',
        percentage: 32,
        amount: 3436
    },
    {
        icon: 'icon-blender-grey',
        title: 'Blender',
        percentage: 35,
        amount: 3720
    },
    {
        icon: 'icon-luxrenderer',
        title: 'Luxrenderer',
        percentage: 35,
        amount: 3720
    }
]

export default class Performance extends React.Component {

    constructor(props) {
        super(props);
    }

    loadList(data) {
        return data.map(({icon, title, percentage, amount}, index) => <div className="list-item__performance" key={index.toString()}>
    		<span className={'icon__list-item__acount ' + icon}>
    			<span className="path1"></span>
    			<span className="path2"></span>
    			<span className="path3"></span>
    		</span>
    		<span className="title__list-item__acount">{title}</span>
    		<progress value={percentage} max="100"></progress>
    		<span className="amount__list-item__performance">{amount}</span>
    	</div>)
    }

    render() {
        return (
            <div className="content__performance">
            	<div className="list__performance">
            		{this.loadList(mockList)}
            	</div>
            	<button className="btn--outline">Recount</button>
            </div>
        );
    }
}
