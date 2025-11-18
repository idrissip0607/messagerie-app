"use client"
import { useParams } from 'next/navigation'
import dynamic from "next/dynamic";
function VideoCall() {
  

// Import du composant dynamiquement (⚡ ssr désactivé)
const VideoLive = dynamic(() => import("@/components/VideoLive"), {
  ssr: false,
});
    const {idUser} = useParams()


  return (
    <div className='flex h-screen justify-center items-center'>
      <VideoLive/>
    </div>
  )
}

export default VideoCall
