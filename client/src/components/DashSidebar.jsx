import {Sidebar} from 'flowbite-react'
import { useEffect, useState } from 'react'
import {HiUser,HiArrowSmRight, HiOutlineDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import { signoutSuccess } from '../redux/user/userSlice'

const DashSidebar = () => {
    const location = useLocation()
    const [tab,setTab] = useState('')
    const dispatch = useDispatch()
    const {currentUser} = useSelector(state => state.user)

    useEffect(()=>{
        const urlParmas = new URLSearchParams(location.search) 
        const tabFromUrl = urlParmas.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    },[location.search])


// ------------------------------------------- HANDLERS --------------------------------------
const handleSignout = async() =>{
        try {
           const res = await fetch('/api/user/signout',{
            method:'POST'
           })
           const data = await res.json()
           if(!res.ok){
            console.log(data.messge)
           } else {
                dispatch(signoutSuccess())
           }
        } catch (error) {
            console.log(error.messge)
        }
    }




// ------------------------------------------- JSX --------------------------------------
  return (
    <Sidebar className='w-full md:w-56'> 
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to='/dashboard?tab=dash'>
                    <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartPie}  as='div'>
                        Dashboard
                    </Sidebar.Item>
                </Link>

                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor = 'dark' as='div'>
                        Profile
                    </Sidebar.Item>
                </Link>

                <Link to='/dashboard?tab=users'>
                    <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} 
                    // label={currentUser.isAdmin ? 'Admin' : 'user'}
                    labelColor = 'dark' as='div'>
                        Users
                    </Sidebar.Item>
                </Link>
                
                {currentUser && (<>
                    <Link to='/dashboard?tab=posts'>
                    <Sidebar.Item active={tab === 'posts'} icon={HiOutlineDocumentText} as='div'>
                        Posts
                    </Sidebar.Item>
                    </Link>

                    <Link to='/dashboard?tab=comments'>
                    <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as='div'>
                        Comments
                    </Sidebar.Item>
                    </Link>
                </>)}
                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' as='div' onClick={handleSignout}>
                        Sign Out
                    </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar