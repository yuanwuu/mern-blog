import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tr-3xl rounded-bl-3xl text-center'>
        <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-2xl'>Javascript?</h2>
            <p className='text-gray-500 my-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, pariatur.</p>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-l rounded-bl-none'>
                <a href="#" target='blank' rel='noopener noreferrer'>Learn More</a>
            </Button>
        </div>
            <div className='p-7 flex-1'>
                <img src="https://res.cloudinary.com/practicaldev/image/fetch/s--ohpJlve1--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://res.cloudinary.com/drquzbncy/image/upload/v1586605549/javascript_banner_sxve2l.jpg" />
            </div>
    </div>
  )
}

export default CallToAction