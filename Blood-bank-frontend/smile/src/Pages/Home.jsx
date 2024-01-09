import React from 'react'
import HomePage from '../assets/NewHome.svg'
import Img1 from '../assets/Home1.jpeg'
import Img2 from '../assets/Home2.jpg'
import Img3 from '../assets/Home3.jpg'
import Img4 from '../assets/Home4.jpg'
import Img5 from '../assets/Home5.jpg'
import { motion } from 'framer-motion'


const imgDiv = {
    hidden : {
        opacity : 0
    },
    show : {
        opacity : 1,
        transition : {
            delay : 0.6,
            delayChildren : 1
        }
    }
}

const sentence = {
    initial : {
        x : '-100vw'
    },
    animate : {
        x : 0,
        transition : {
            delay : 1,
            stiffness : 100
        }
    },
    animateP : {
        x : 0,
        transition : {
            delay : 1.2,
            stiffness  : 100
        }
    },
    


}



const Home = () => {
    return (
        <>
            <div className="home_outer">
                {/* ----------- Landing Section ------------- */}
                <div className="landing">
                    <div  className="left">
                        <motion.h5 variants={sentence} initial='initial' animate='animate'>
                            Donate Your Blood to Us, Save More Life Together
                        </motion.h5>

                        <motion.p variants={sentence} initial='initial' animate='animateP'>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit, mollitia! Corrupti natus totam eligendi excepturi deserunt explicabo vel, dolores rerum labore earum sed possimus quo molestiae doloribus magni dolorum voluptates!
                        </motion.p>
                    </div>
                    <img src={HomePage} alt="HomePage" />
                </div>
                {/* ------------ About Section ------------- */}
                <div className="about">
                    <div className="about_content">
                        <motion.div variants={imgDiv} initial='hidden' animate='show'  className="photo_gallery">
                            <img src={Img4} alt="Img2" />
                            <img src={Img3} alt="Img1" />
                            <img src={Img1} alt="Img3" />
                            <img src={Img5} alt="Img4" />
                            <img src={Img2} alt="Img5" />
                        </motion.div>  
                        <div className="about_smile">
                            <motion.div className="container"
                                variants={imgDiv}
                                initial='hidden'
                                whileInView='show'
                                viewport={{
                                        once: true
                                    }}  
                            >
                                <motion.h5
                                    initial={{
                                        x : -100
                                    }}
                                    whileInView={{
                                        x : 0
                                    }}
                                    transition={{
                                        delay: 1
                                    }}
                                    viewport={{
                                        once: true
                                    }}
                                >
                                    About Smile
                                </motion.h5>

                                <motion.p
                                    initial={{
                                        x : '-100%'
                                    }}
                                    whileInView={{
                                        x : 0
                                    }}
                                    transition={{
                                        delay : 1.2,
                                        stiffness : 100
                                    }}
                                    viewport={{
                                        once: true
                                    }}
                                >
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum nobis sequi officiis assumenda neque mollitia beatae sed nostrum exercitationem, eius illo praesentium ducimus explicabo molestias, repudiandae modi maiores nam. Quibusdam, non voluptatem, veniam alias voluptates asperiores ipsum corrupti illum minima sequi repellendus velit voluptatum. Vitae eos harum rem architecto accusantium itaque velit iusto voluptatibus impedit ducimus, minus quae necessitatibus amet temporibus dolorem ipsum distinctio. Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita nisi repellat iusto aperiam commodi aspernatur eveniet doloribus tenetur officia nemo. 
                                </motion.p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Home