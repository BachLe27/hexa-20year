const Videos = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <div className='z-101 '>
      <video width="1000">
        <source src="https://github.com/BachLe27/test/raw/refs/heads/main/o2-1.mp4" type="video/mp4" />
        Your browser does not support HTML video.
      </video>

      <button className='bg-white text-black px-4 py-2 rounded-md absolute bottom-10 right-10 cursor-pointer' onClick={nextStep}>Bỏ qua</button>
    </div>
  )
}

export default Videos