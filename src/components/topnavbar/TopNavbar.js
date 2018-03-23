import React from 'react';
import './TopNavbar.css';
import { Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'

const TopNavbar = () => {
    return (
        <Nav className="navbar fixed-top navbar-transparent" color-on-scroll="500">
            <div className="container">
                <Link className="navbar-brand" to="/speechify">Home</Link>
                <NavItem className="navbar-nav ml-auto">
                    <Link className="nav-link" rel="tooltip" title="Star on GitHub" data-placement="bottom" to="https://www.github.com/sdeagh/speechify" target="_blank">
                        <FontAwesome style={{ color: 'white'}} name='github' size='2x' />
                    </Link>
                </NavItem>
            </div>
        </Nav>
    )
}

export default TopNavbar;