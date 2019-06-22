import React, {Component, Fragment} from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";


class Sidebar extends Component {

	render() {

		return (
            <Fragment>
                <List>
                    <Link to="/livestock/add">
                        <ListItem button>
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faPlus} size="lg" />
                            </ListItemIcon>
                            <ListItemText primary="Add New Livestock" />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
            </Fragment>
			
		);
	}
}

export default Sidebar;