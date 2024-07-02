import React from 'react'
import HeroContainer from './Hero/HeroContainer'
import Gallary from './Gallary/Gallary'
import PopularClasses from './PopularClasses/PopularClasses'
import PopularTeacher from './PopularTeacher/PopularTeacher'
import WebInfo from './WebInfo/WebInfo'
import Footer from './Footer/Footer'

const Home = () => {
  return (
    <section>
      <HeroContainer/>
      <div className='max-w-screen-xl mx-auto'>
        <section className='mb-12'>
            <Gallary/>
        </section>

        <section className='mb-12'>
        <PopularClasses/>
        </section>
           
        <section className='mb-12'>
        <PopularTeacher />
        </section>
          
           <section className='mb-12'>
           <WebInfo/>
           </section>
           
           <Footer/>
      </div>
    </section>
  )
}

export default Home
