import { Stack } from "@mui/material"
import { useRef, useState } from "react";

const Videos = ({ nextStep }: { nextStep: () => void }) => {
  const videoRef = useRef(null);
  const [opacity, setOpacity] = useState(1);

  const handleEnded = () => {
    setOpacity(0);
    setTimeout(() => {
      nextStep();
    }, 1000);
  }

  return (
    <Stack className='z-150' alignItems='center' justifyContent='center'>
      <div style={{
        opacity: opacity,
        transition: 'opacity 1s ease-in-out',
        width: '100%',
        height: '100vh'
      }}>
        <video onEnded={handleEnded} ref={videoRef} className="z-150 h-[100vh] w-full" autoPlay>
          <source src='/0522.mp4' type="video/mp4" />
          Your browser does not support HTML video.
        </video>
      </div>

      <button className='border-2 border-white text-white px-4 py-2 rounded-md absolute bottom-10 right-10 cursor-pointer z-151' onClick={nextStep}>Bỏ qua</button>
    </Stack>
  )
}

export default Videos