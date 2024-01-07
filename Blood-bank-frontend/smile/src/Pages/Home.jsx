import React from 'react'
import HomePage from '../assets/NewHome.svg'
import Img1 from '../assets/Home1.jpeg'
import Img2 from '../assets/Home2.jpg'
import Img3 from '../assets/Home3.jpg'
import Img4 from '../assets/Home4.jpg'
import Img5 from '../assets/Home5.jpg'

const Home = () => {
    return (
        <>
            <div className="home_outer">
                {/* ----------- Landing Section ------------- */}
                <div className="landing">
                    <div className="left">
                        <h5>
                            Donate Your Blood to Us, Save More Life Together
                        </h5>

                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit, mollitia! Corrupti natus totam eligendi excepturi deserunt explicabo vel, dolores rerum labore earum sed possimus quo molestiae doloribus magni dolorum voluptates!
                        </p>
                    </div>
                    <img src={HomePage} alt="HomePage" />
                </div>
                {/* ------------ About Section ------------- */}
                <div className="about">
                    <div className="about_content">
                        
                        <div className="photo_gallery">
                            <img src={Img4} alt="Img2" />
                            <img src={Img3} alt="Img1" />
                            <img src={Img1} alt="Img3" />
                            <img src={Img5} alt="Img4" />
                            <img src={Img2} alt="Img5" />
                        </div>  
                        <div className="about_smile">
                            <div className="container">
                                <h5>
                                    About Smile
                                </h5>

                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum nobis sequi officiis assumenda neque mollitia beatae sed nostrum exercitationem, eius illo praesentium ducimus explicabo molestias, repudiandae modi maiores nam. Quibusdam, non voluptatem, veniam alias voluptates asperiores ipsum corrupti illum minima sequi repellendus velit voluptatum. Vitae eos harum rem architecto accusantium itaque velit iusto voluptatibus impedit ducimus, minus quae necessitatibus amet temporibus dolorem ipsum distinctio. Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita nisi repellat iusto aperiam commodi aspernatur eveniet doloribus tenetur officia nemo. 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Home