import React from 'react'
import HomePage from '../assets/NewHome.svg'



const Home = () => {
    return (
        <>
            <div className="home_outer">
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
        </>

    )
}

export default Home