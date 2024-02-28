import {Link} from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard'
import { useState,useEffect } from 'react'

const Home = () => {
  const [posts, setPosts] = useState([])

  useEffect(()=>{
    try {
      const fetchPosts = async()=>{
        const res = await fetch('/api/post/getPosts')
        const data = await res.json()
        setPosts(data.posts)
      }
      fetchPosts()
    } catch (error) {
      console.log(error.message);
    }
  },[])


  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='texy-gray-500 text-xs sm:text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio dignissimos ab, ea consectetur autem repudiandae architecto qui! Quod quia error sit esse eveniet asperiores praesentium, iure, perspiciatis voluptas totam hic!</p>
      <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
      view all posts</Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {
          posts && posts.length > 0 && (
            <div className="">
              <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2> 
              <div className="flex flex-wrap gap-4">
                {
                  posts.map((post)=>(
                    <PostCard key={post._id} post={post}/>
                  ))
                }
              </div>
              <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center'>
              View all Posts</Link>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home