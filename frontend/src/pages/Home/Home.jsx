import React from 'react'
import HeroContainer from './Hero/HeroContainer'
import Gallary from './Gallary/Gallary'
import PopularClasses from './PopularClasses/PopularClasses'

const Home = () => {
  return (
    <section>
      <HeroContainer/>
      <div className='max-w-screen-xl mx-auto'>
           <Gallary/>
           <PopularClasses/>
      </div>
    </section>
  )
}

export default Home
