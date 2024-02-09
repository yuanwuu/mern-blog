import {Button, TextInput,Alert,Modal} from 'flowbite-react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage'
import {app} from '../firebase'

import { useEffect, useRef,useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { 
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess 
} from '../redux/user/userSlice';




const DashProfile = () => {
    const {currentUser,error} = useSelector(state => state.user)
    const filePickerRef = useRef()
    const dispatch = useDispatch()

// ----------------------------------------- STATES -----------------------------------------
    const [formData, setFormData] = useState({})

    const [imgFile, setImgFile] = useState(null)
    const [imgFileUrl,setImgFileUrl] = useState(null)
    const [imgUploadProgress, setImgUploadProgress] = useState(null)
    const [imgUploadError, setImgUploadError] = useState(null)
    const [imgUploading, setImgUploading] = useState(false)

    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    
    const [showModal,setShowModal] = useState(false)

    
    const uploadImage = async() =>{
        // Firebase storage rules
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write: if 
        //         request.resource.size < 2*1024*1024 &&
        //         request.resource.contentType.matches('image/.*')
        //       }
        //     }
        //   }
        setImgUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imgFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef,imgFile)
        uploadTask.on(
            'state_changed',
            (snapshot) =>{
                const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImgUploadProgress(progress.toFixed(0))
            },
            (error) =>{
                setImgUploadError('Image not uploading (file must less than 2mb)')
                setImgUploadProgress(null)
                setImgFile(null)
                setImgFileUrl(null)
                setImgUploading(false)
            },
            () =>{
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL =>{
                    setImgFileUrl(downloadURL)
                    setFormData({...formData, profilePicture: downloadURL})
                    setImgUploading(false)
                })
            }
        )
    }

    useEffect(()=>{
        if(imgFile){uploadImage()}
    },[imgFile])


// ----------------------------------------- HANDLERS -----------------------------------------
    const handleImgChange =(e) =>{
        const file = e.target.files[0]
        if (file){
            setImgFile(file)
            setImgFileUrl(URL.createObjectURL(file))
        }
    }

    const handleChange = (e) =>{
        setFormData({...formData, [e.target.id]: e.target.value})
    }
   
    const handleSubmit = async (e) =>{
        e.preventDefault()
        setUpdateUserError(null)
        setUpdateUserSuccess(null)
        if(Object.keys(formData).length === 0){
            setUpdateUserError('No changes made')
            return
        }
        if(imgUploading){
            setUpdateUserError('Please wait for image to upload')
            return 
        }
        try {
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            })
            // console.log('response:',res)
            const data = await res.json()
            if(!res.ok){
                dispatch(updateFailure(data.messge))
                setUpdateUserError(data.messge)
            } else{
                dispatch(updateSuccess(data))
                setUpdateUserSuccess('User profile updated successfully')
            }
        } catch (error) {
            dispatch(updateFailure(error.messge))
        }
    }
   
    const handleDeleteUser = async(e) =>{ 
        setShowModal(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                method:'DELETE'
            })
            const data = await res.json()
            if(!res.ok){
                dispatch(deleteUserFailure(data.messge))
            } else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.messge))
        }
    }

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

// ----------------------------------------- JSX -----------------------------------------

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <input type='file' accept='image/*' onChange={handleImgChange} ref={filePickerRef} hidden/>
            <div id="profile-pic" className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>{filePickerRef.current.click()}}>
                {imgUploadProgress && (
                    <CircularProgressbar value={imgUploadProgress || 0} text={`${imgUploadProgress}%`} strokeWidth={5}
                    styles={{
                        root:{
                            width:'100%',
                            height:'100%',
                            position:'absolute',
                            top: 0,
                            left: 0
                        },
                        path:{
                            stroke:`rgba(62,152,199, ${imgUploadProgress /100})` 
                        },
                    }}
                    />
                )}
                <img src={imgFileUrl || currentUser.profilePicture} alt='user' className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${imgUploadProgress && imgUploadProgress < 100 && 'opacity-60' }`} />
            </div>
            {imgUploadError && <Alert color='failure'>{imgUploadError}</Alert>}

            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
            <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
            <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                Update
            </Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span onClick={()=> setShowModal(true)} className='cursor-pointer'>Delete Account</span>
            <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
        </div>

        {updateUserSuccess && <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>}
        {updateUserError && <Alert color='failure' className='mt-5'>{updateUserError}</Alert>}
        {error && <Alert color='failure' className='mt-5'>{error}</Alert>}

        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
            <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Confirm to deactivate account?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>Yes</Button>
                            <Button color='gray' onClick={()=>setShowModal(false)}>No</Button>
                            </div>
                        </div>
                    </Modal.Body>
            </Modal>
    </div>
  )
}

export default DashProfile