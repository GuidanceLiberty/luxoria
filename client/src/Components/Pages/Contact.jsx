import React from 'react'

const Contact = () => {
  return (
    <>
      <div className="contact-section mt-5">
        <div className="container">
            <h2 className="section-title">
                Keep In Touch With Us
            </h2>
            <p className="section-subtitle">
                Be the first to know about new skincare launches, exclusive offers and <br /> expert beauty tips for radiant skin.
            </p>

            <div className="row contact-boxes">
                {/* Address */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="contact-col">
                        <div className="contact-box bg-transparent border-0">
                            <i className="ri-map-pin-line icon"></i>
                            <h5>Address</h5>
                            <p>Random IT Solutions, 2nd Floor, Siddharth Complex,</p>
                            <p className="mb-4">Alkapuri, Vandora, Gujarat - 39007</p>
                            <a href="https://maps.app.goo.gl/2XwiSp3JK3V6FCg4A" target='_blank' rel='noopener noreferrer' className="link">Get Direction</a>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="contact-col">
                        <div className="contact-box bg-transparent border-0">
                            <i className="ri-phone-line icon"></i>
                            <h5>Contact</h5>
                            <p><strong>Mobile:</strong> +234 911 2524 812</p>
                            <p><strong>Hotline:</strong> 0911 2524 812</p>
                            <p><strong>E-mail:</strong> support@newguidance4141@gmail.com</p>
                        </div>
                    </div>
                </div>

                {/* Hours */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="contact-col">
                        <div className="contact-box bg-transparent border-0">
                            <i className="ri-time-line icon"></i>
                            <h5>Hour of operation</h5>
                            <p><strong>Mon - Fri:</strong> 08:30 - 20:00</p>
                            <p><strong>Sat - Sun:</strong> 09:30 - 21:30</p>              
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="contact-page">
        {/* Map Section */}
        <section className="map-section">
            <div className="container">
                <iframe 
                    title='Our Location' 
                    className='map rounded'
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2843.4853847528575!2d3.3471170731180973!3d6.605411322209927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b923211b96911%3A0xd3abad8f69c49cd6!2s105%20Allen%20Ave%2C%20Road%2C%20Lagos%20101233%2C%20Lagos!5e1!3m2!1sen!2sng!4v1753047973926!5m2!1sen!2sng" 
                    allowFullScreen 
                    loading="lazy">
                </iframe>
            </div>
        </section>

        {/* Contact Form Section*/}
        <div className="message-section">
            <div className="container">
                <h2 className="form-title">Send a Message</h2>
                <form className="contact-form">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input type="text" className="input" placeholder='Name' required/>
                        </div>
                        <div className="col-md-6 mb-3">
                            <input type="email" className="input" placeholder='Email' required/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <textarea className="textarea" placeholder='Message' required></textarea>
                        </div>
                    </div>
                    <div className="text-center">
                        <button type='submit' className="btn px-5">Submit</button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </>
  )
}

export default Contact