import React from 'react'
import HomePage from '../assets/NewHome.svg'
import Img1 from '../assets/Boold-donation-2023-1.jpeg'
import Img2 from '../assets/IMG_20191011_125835.jpg'
import Img3 from '../assets/376565_3_ce3b17b12e3d007408ee369f5f318dd07d0dc1d3_medium.jpeg'

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
                            <img src="https://scontent.fccu4-3.fna.fbcdn.net/v/t39.30808-6/361849220_311628554622379_2953448472405947231_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=3635dc&_nc_ohc=oPeKzwIRI8UAX9FmPUR&_nc_ht=scontent.fccu4-3.fna&oh=00_AfCW4TFLeah0IXwiZE95zOppUeMLtG-RvvU0-IOKCvzFUA&oe=658DD3C9" alt="smile" />
                            <img src="https://scontent.fccu4-2.fna.fbcdn.net/v/t39.30808-6/363412435_316069044178330_2802847480002163376_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=3635dc&_nc_ohc=dEZIPXVT21EAX9ile7U&_nc_ht=scontent.fccu4-2.fna&oh=00_AfDl8PUR9HfpFuM6biUoJfmDFv8B-b9-Gu8nsYpIzQm1ig&oe=658D56AC" alt="smile" />
                            <img src="https://scontent.fccu4-2.fna.fbcdn.net/v/t39.30808-6/361168479_309524321499469_7586431885899971888_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=3635dc&_nc_ohc=OqLkzUZhaZwAX8dBIbX&_nc_ht=scontent.fccu4-2.fna&oh=00_AfBVa6ZT60zNUHYh5R810Y_EUsYBv0HTGLVjLcHc2jueSw&oe=658E3E95" alt="" />
                            <img src="https://scontent.fccu4-2.fna.fbcdn.net/v/t39.30808-6/355888442_297600649358503_7134958365396399118_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=3635dc&_nc_ohc=2HSnbbtbTdAAX9uX2VX&_nc_ht=scontent.fccu4-2.fna&oh=00_AfCPvgBsAP_nsQWUYHVIwM7QAyrBqO1CYkJgXEJKe04jZA&oe=658DADA1" alt="" />
                            <img src="https://scontent.fccu4-2.fna.fbcdn.net/v/t39.30808-6/354051545_293427156442519_2332232639849606775_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=3635dc&_nc_ohc=fHC5JfNG-Z8AX_l7ZET&_nc_ht=scontent.fccu4-2.fna&oh=00_AfDjb_tUrf6VsKxPuW9-y9LcZBukncTRVDjd3z_He5q7hw&oe=658CCF3F" alt="" />
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