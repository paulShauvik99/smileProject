import React from 'react'
import wave1 from '../assets/wave1.svg'
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
                    <img className='footBg' src={wave1} alt="" />
                    <img className='footBg' src={wave3} alt="" />
                    <img className='footBg' src={wave4} alt="" />
                    <div className="footer_details">
                        <div className="part1">
                            <img src={SmileLogo} className='footLogo' alt="logo" />
                        </div>
                        <div className="part2">
                                <IconButton href='https://www.google.com' target='_blank'>
                                    <InstagramLogo color="#191818" className='icons' weight="duotone" />
                                </IconButton>
                                <IconButton>
                                    <FacebookLogo color="#191818" className='icons' weight="duotone" />
                                </IconButton>
                                <IconButton>
                                    <TwitterLogo color="#191818" className='icons' weight="duotone" />
                                </IconButton>
                                <IconButton>
                                    <YoutubeLogo color="#191818" className='icons' weight="duotone" />
                                </IconButton>
                        </div>
                        <div className="part3">
                                <div className="con">
                                    <MapPin size={26} className='con_icons'color="#191818" weight="duotone" /> <p>  Some Lane, Silchar, Cachar, Assam, Pincode - 788 005 </p>
                                </div>
                                <div className="con">
                                    <Phone size={26} className='con_icons' color="#191818" weight="duotone" /> <p>  +91 9832738882 </p>
                                </div>
                                <div className="con">
                                    <Envelope size={26} className='con_icons' color="#191818" weight="duotone" /> <p>  somesmile@gmail.com </p>
                                </div>
                                <div className="con">
                                    <Clock size={26} className='con_icons' color="#191818" weight="duotone" /> <p>  Working Hours : 9:00 AM - 6:00 PM </p>
                                </div>



                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}

export default Footer