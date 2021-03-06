import React from 'react';
import TopNavbar from '../../components/topnavbar/TopNavbar';
import Footer from '../../components/footer/Footer';
import './TitlePage.css';
import { Link } from 'react-router-dom';

const TitlePage = () => {
    return (
        <div>
            <TopNavbar />
            <div className="pageSetup">
                <div className="container d-flex flex-column align-items-center">
                    <div className="title-brand">
                        <Link to='/speechify/stt' className='titleLink'>
                            <h1 className="titleText">Speech to Text</h1>
                        </Link> 
                    </div>
                    <hr/>
                    <div className="title-brand">
                        <Link to='/speechify/tts' className='titleLink'>
                            <h1 className="titleText">Text to Speech</h1>
                        </Link>
                    </div>
                    <h6 className="text-center dedication">Background in memory of Professor Stephen Hawking (1942-2018)</h6>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default TitlePage;