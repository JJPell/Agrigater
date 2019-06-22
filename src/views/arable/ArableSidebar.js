import React, {Component, Fragment} from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Satellite from '@material-ui/icons/Satellite';
import PlayForWork from '@material-ui/icons/PlayForWork';
import { Link } from "react-router-dom";


class Sidebar extends Component {

	render() {

		return (
            <Fragment>
                <List>
                    <Link to="/arable/addfarm">
                        <ListItem button>
                            <ListItemIcon>
                                <Satellite />
                            </ListItemIcon>
                            <ListItemText primary="Add Farm" />
                        </ListItem>
                    </Link>
                    <Link to="/arable/addfield">
                        <ListItem button>
                            <ListItemIcon>
                                <Satellite />
                            </ListItemIcon>
                            <ListItemText primary="Add Field" />
                        </ListItem>
                    </Link>
                    <Divider />
                    <Link to="/arable/addjob">
                        <ListItem button>
                            <ListItemIcon>
                                <PlayForWork />
                            </ListItemIcon>
                            <ListItemText primary="Add New Job" />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
            </Fragment>
			
		);
	}
}

export default Sidebar;