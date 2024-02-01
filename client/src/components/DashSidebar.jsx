import {Sidebar} from 'flowbite-react'
import { useEffect, useState } from 'react'
import {HiUser,HiArrowSmRight} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'

const DashSidebar = () => {
    const location = useLocation()
    const [tab,setTab] = useState('')
    useEffect(()=>{
        const urlParmas = new URLSearchParams(location.search) //
        const tabFromUrl = urlParmas.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    },[location.search])

  return (
    <Sidebar className='w-full md:w-56'> 
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor = 'dark' as='div'>
                        Profile
                    </Sidebar.Item>
                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' as='div'>
                        Sign Out
                    </Sidebar.Item>
                </Link>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar