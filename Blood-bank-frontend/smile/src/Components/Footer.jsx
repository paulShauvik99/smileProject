import React from 'react'
import wave1 from '../assets/wave1.svg'
import wave2 from '../assets/wave2.svg'
import wave3 from '../assets/wave3.svg'
import wave4 from '../assets/wave4.svg'
import SmileLogo from '../assets/SmileLogo.png'
import { InstagramLogo, FacebookLogo, TwitterLogo, YoutubeLogo, MapPin, Phone, Envelope, Clock} from "@phosphor-icons/react";
import IconButton from '@mui/material/IconButton';




const Footer = () => {
    return (
        <>
            <div className="footer_outer">
                <div className="footer_inner">
                    <img src={wave1} alt="" />
                    {/* <img src={wave2} alt="" /> */}
                    <img src={wave3} alt="" />
                    <img src={wave4} alt="" />

                    <div className="footer_details">

                        <div className="part1">
                            <img src={SmileLogo} alt="logo" />
                        </div>
                        <div className="part2">

                            <div className="social_links">
                                <IconButton>
                                    <InstagramLogo color="#ce2432" className='icons' weight="duotone" />
                                </IconButton>
                                <IconButton>
                                    <FacebookLogo color="#ce2432" className='icons' weight="duotone" />
                                </IconButton>
                                <IconButton>
                                    <TwitterLogo color="#ce2432" className='icons' weight="duotone" />
                                </IconButton>
                                <IconButton>
                                    <YoutubeLogo color="#ce2432" className='icons' weight="duotone" />
                                </IconButton>
                            </div>

                        </div>
                        <div className="part3">
                            <div className="contact_info">
                                <div className="con">
                                    <MapPin size={26} className='con_icons'color="#ce2432" weight="duotone" /> <p>  Some Lane, Silchar, Cachar, Assam, Pincode - 788 005 </p>
                                </div>
                                <div className="con">
                                    <Phone size={26} className='con_icons' color="#ce2432" weight="duotone" /> <p>  +91 9832738882 </p>
                                </div>
                                <div className="con">
                                    <Envelope size={26} className='con_icons' color="#ce2432" weight="duotone" /> <p>  somesmile@gmail.com </p>
                                </div>
                                <div className="con">
                                    <Clock size={26} className='con_icons' color="#ce2432" weight="duotone" /> <p>  Working Hours : 9:00 AM - 6:00 PM </p>
                                </div>
                            </div>



                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}

export default Footer