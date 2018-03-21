import React from 'react';
import './Footer.css';
import FontAwesome from 'react-fontawesome'
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row d-flex justify-content-end">
                    <div className="credits">
                        <span className="copyright" >
                            © { (new Date().getFullYear()) }, made with <FontAwesome className='heart' style={{ color: '#EB5E28'}} name='heart'></FontAwesome> by <Link to="https://www.github.com/sdeagh" target="_blank">S design</Link>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;