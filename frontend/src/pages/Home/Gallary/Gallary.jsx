import React from 'react'
import image1 from "../../../assets/gallary/image1.png"
import image2 from "../../../assets/gallary/image2.png"
const Gallary = () => {
  return (
    <div className='md:w-[80%] mx-auto my-28'>
        <div className='mb-16'>
            <h1 className='text-5xl font-bold text-center'>Our Gallary</h1>
        </div>

        {/* image container  */}
        <div className='md:grid grid-cols-2 items-center justify-center  gap-4'>
            <div className='mb-4 md:mb-0'>
                <img src={image1} alt='' className='md:h-[720px] w-full mx-auto rounded-sm'/>
            </div>
            <div className='gap-4 grid grid-cols-2 items-start'>
                <div>
                    <img src={image2} alt="" className='md:h-[350px] rounded-sm'/>
                </div>
                <div>
                    <img src={image2} alt="" className='md:h-[350px] rounded-sm'/>
                </div>
                <div>
                    <img src={image2} alt="" className='md:h-[350px] rounded-sm'/>
                </div>
                <div>
                    <img src={image2} alt="" className='md:h-[350px] rounded-sm'/>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Gallary
