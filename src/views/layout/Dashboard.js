import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Sidebar from "./Sidebar";

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const drawerWidth = 260;

const styles = theme => ({
  root: {
    flexGrow: 1,
	height: "100%",
	minHeight: "100vh",
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    height: "100%",
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 7,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  button: {
    margin: theme.spacing.unit,
    color: "#FFF",
	},
	headerIcon: {
		height: "36px",
	},
});

class Dashboard extends React.Component {

	constructor() {
		super();

		this.state = {
			open: JSON.parse(localStorage.getItem("sidebar")) ? false : true
		}
	}

	handleDrawerOpen = () => {
		this.setState({ open: true });
		localStorage.setItem("sidebar", true);
	};

	handleDrawerClose = () => {
		this.setState({ open: false });
		localStorage.setItem("sidebar", false);
	};

	toggleDrawer = () => {
		localStorage.setItem("sidebar", !this.state.open);
		this.setState({ open: !this.state.open });
	};

	signOut = () => {
		localStorage.removeItem("token");
	}

	render() {

		const { classes, theme } = this.props;

		return (
		<div className={classes.root}>
			<AppBar
			position="absolute"
			className={classNames(classes.appBar)}
			>
			<Toolbar>
				<IconButton
				color="inherit"
				aria-label="Open drawer"
				onClick={this.toggleDrawer}
				className={classNames(classes.menuButton)}
				>
				<MenuIcon />
				</IconButton>
				<img src="/img/logo/Icon2.png" className={classes.headerIcon} />
				<Link to="/">
					<Button className={classes.button}>
						Report
					</Button>
				</Link>
				<Link to="/arable">
					<Button className={classes.button}>
						Arable
					</Button>
				</Link>
				<Link to="/livestock">
					<Button className={classes.button}>
						Livestock
					</Button>
				</Link>
				<Link to="/stock">
					<Button className={classes.button}>
						Stock
					</Button>
				</Link>
				<Link to="/account" className="ml-auto">
					<Button className={classes.button} onClick={this.signOut}>
						My Account
					</Button>
				</Link>
				<Link to="/signin">
					<Button className={classes.button} onClick={this.signOut}>
						Sign Out
					</Button>
				</Link>
			</Toolbar>
			</AppBar>
			{!this.props.hideSidebar ? 

			<Drawer
			variant="permanent"
			classes={{
				paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
			}}
			open={this.state.open}
			>
			<br />
			<br />
			<br />

			<Divider />
				{this.props.sidebar}
			</Drawer>

			: <Fragment />}

			<main className={classes.content}>
			<div className={classes.toolbar} />
			{this.props.children}
			</main>
		</div>
		);
	}
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Dashboard);