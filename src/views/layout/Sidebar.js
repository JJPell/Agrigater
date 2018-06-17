import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import { Link } from "react-router-dom";


class Sidebar extends Component {

	

	render() {

		let links = this.props.links || [];

		return (

		<ul className="sidebar nav flex-column p-4">

			{links.map((link, i) => {
				return 	<li className="nav-item" key={i}>
							<Link className="nav-link btn btn-primary btn-outline-primary" to={link.href}>
								{link.name}
							</Link>
						</li>
				}
			)}
		
		</ul>
			
		);
	}
}

export default Sidebar;