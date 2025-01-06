import React from "react";
import "./Footer.css";
import {assets} from '../../assets/assets'

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam facilis fugiat necessitatibus alias! Laboriosam harum esse fugiat, voluptatem quod sequi nesciunt tempore, distinctio ratione excepturi sint suscipit repellendus natus omnis?</p>
            <div className="footer-social-icons">
               <img src={assets.facebook_icon} alt="" />
               <img src={assets.twitter_icon} alt="" />
               <img src={assets.linkedin_icon} alt="" /> 
            </div>    
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+1-234-567-8910</li>
                <li>contact@tomato.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © Tomato.com - All Rights Reserved.</p>
    </div>
  );
};

export default Footer;
