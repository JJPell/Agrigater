import React, {Fragment} from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Satellite from '@material-ui/icons/Satellite';
import PlayForWork from '@material-ui/icons/PlayForWork';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


import { Link } from "react-router-dom";


class Sidebar extends React.Component {


	render() {

		return (
            <Fragment>
                <List>
                    <Link to="/stock/add">
                        <ListItem button>
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faPlus} size="lg" />
                            </ListItemIcon>
                            <ListItemText primary="Add Stock" />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
            </Fragment>
			
		);
	}
}

export default Sidebar;