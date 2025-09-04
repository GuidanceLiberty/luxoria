/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

import head from '../../assets/about-head-shape.webp'
import about1 from './../../assets/banner-female-2.webp'
import about2 from '../../assets/discover-1.webp'
import client1 from '../../assets/brand-logo-1.png'
import client2 from '../../assets/brand-logo-2.png'
import client3 from '../../assets/brand-logo-3.png'
import client4 from '../../assets/brand-logo-4.png'
import client5 from '../../assets/brand-logo-5.png'
import client6 from '../../assets/brand-logo-6.png'
import team1 from '../../assets/team-1.webp'
import team2 from '../../assets/fega.jpg'
import team3 from '../../assets/osinachi.png'

const About = () => {
    const [quote, setQuote] = useState(
        '" Quality products at great prices, delivering the perfect mix of affordability and excellence. Each item ensures great value for money."'
    );

    const quotes = {
        client1: '" Quality products at great prices, delivering the perfect mix of affordability and excellence. Each item ensures great value for money."',
        client2: '" Outstanding customer service and premium quality products that exceed expectations every time. Truly exceptional experience."',
        client3: '" Innovative designs and superior craftsmanship make this brand stand out from the competition. Highly recommended for quality seekers."',
        client4: '" Reliable, durable, and beautifully crafted products that deliver on their promises. Worth every penny invested."',
        client5: '" Fresh approach to skincare with natural ingredients that actually work. My skin has never looked better."',
        client6: '" Sustainable, eco-friendly products that don\'t compromise on performance. Perfect for conscious consumers."'
    };

  return (
    <>
      {/* About Header */}
      <section className="about-glowing-section d-flex align-items-center" style={{minHeight: '400px', backgroundColor: '#f8f9fa'}}>
        <div className="container-fluid px-5">
            <div className="row">
                <div className="col-md-6 text-md-start text-center">
                    <p className="text-uppercase text-muted small mb-2">Introducing</p>
                    <h1 className="fw-bold display-5">About Glowing</h1>
                </div>
            </div>
        </div>
      </section>

      {/* Main About Content */}
      <section className="py-5">
        <div className="container-fluid text-center mb-5 px-5">
            <img src={head} alt="decorative leaf" />
            <h2 className="fw-bold">
                We strive to live with compassion, <br /> kindness and empathy
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '800px'}}>
                A lot of so-called stretch denim pants out there are just sweatpants - they get baggy and lose their shape. Not cool. Our tightly knitted fabric holds its form after repeated wear. Plus, Aldays dress up or down, no prob. So you can wear them all day. Get it?
            </p>
        </div>

        {/* Face Image and Description */}
        <div className="container-fluid mb-5 px-5">
            <div className="row align-items-center">
                <div className="col-md-6 mb-4 mb-md-0 about-img1">
                    <img src={about1} alt="Face" className="img-fluid rounded w-100" />
                </div>
                <div className="col-md-6">
                    <h4 className="fw-bold">Give your skin a healthy glow everyone</h4>
                    <p className="text-muted">
                        Nourish your skin with radiant hydration. Our skincare essentials are crafted with premium ingredients to restore balance, enhance glow, and keep your complexion healthy everyday.
                        Experience the perfect blend of nourishment and luxury for a naturally luminous look.
                    </p>
                </div>
            </div>
        </div>

        {/* Mission and Product Image */}
        <div className="container-fluid px-5">
            <div className="row align-items-center flex-md-row-reverse">
                <div className="col-md-6 mb-4 mb-md-0 about-img">
                    <img src={about2} alt="" className="img-fluid rounded w-100" />
                </div>
                <div className="col-md-6">
                    <h4 className="fw-bold">Our Mission</h4>
                    <p className="text-muted">
                        We believe in healthy, radiant skin for everyone. Our products are thoughtfully crafted with high-quality ingredients to nourish, protect, and enhance your natural glow—because confidence starts with great skin.
                        Experience the perfect fusion of science and nature for skincare that truly transforms.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Interactive client logo section */}
      <section className="container-fluid bg-light">
        <div className="py-5 text-center">
            <div className="mx-auto px-3" style={{ maxWidth: '1000px'}}>
                <p className="fs-4 mb-4 fw-bold">{quote}</p>
            </div>

            <div className="row justify-content-center align-items-center">
                {[client1, client2, client3, client4, client5, client6].map((client, i) => (
                  <div 
                    key={i} 
                    className="col-6 col-sm-4 col-md-2 d-flex justify-content-center brands-img mb-3" 
                    onClick={() => setQuote(Object.values(quotes)[i])} 
                    style={{cursor: 'pointer'}}
                  >
                    <img src={client} alt={`client-${i}`} className="img-fluid" style={{ maxHeight: '60px', objectFit: 'contain'}}/>
                  </div>
                ))}
            </div>
        </div>
      </section>

      {/* Team section */}
      <section className="team-section container-fluid px-5">
        <h2 className="team-title">
            We pride ourselves on having a team of highly skilled
        </h2>

        <div className="team-row">
            <div className="team-member">
                <div className="team-image-wrapper">
                    <img src={team2} alt="Jennifer C." className="team-image" />
                    <div className="team-social">
                        <a href="#"><i className="ri-instagram-line"></i></a>
                        <a href="#"><i className="ri-twitter-line"></i></a>
                        <a href="#"><i className="ri-facebook-line"></i></a>
                        <a href="#"><i className="ri-youtube-line"></i></a>
                    </div>
                </div>
                <h3 className="team-name">Fega Michael</h3>
                <p className="team-role">Founder, CEO</p>
            </div>

            <div className="team-member">
                <div className="team-image-wrapper">
                    <img src={team3} alt="Jennifer C." className="team-image" />
                    <div className="team-social">
                        <a href="#"><i className="ri-instagram-line"></i></a>
                        <a href="#"><i className="ri-twitter-line"></i></a>
                        <a href="#"><i className="ri-facebook-line"></i></a>
                        <a href="#"><i className="ri-youtube-line"></i></a>
                    </div>
                </div>
                <h3 className="team-name">Osinachi Ohale</h3>
                <p className="team-role">Founder, COO </p>
            </div>
        </div>
      </section>
    </>
  )
}

export default About
