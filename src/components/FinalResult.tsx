import { Stack } from '@mui/material';

interface FinalResultProps {
  finalAvatarImage: string;
  finalCardImage: string;
  handleBack: () => void;
}

const FinalResult = ({ finalAvatarImage, finalCardImage, handleBack }: FinalResultProps) => {

  const handleDownloadAvatar = () => {
    const link = document.createElement('a');
    link.href = finalAvatarImage;
    link.download = 'hexa-20years-avatar.png';
    link.click();
  }

  const handleDownloadCard = () => {
    const link = document.createElement('a');
    link.href = finalCardImage;
    link.download = 'hexa-20years-card.png';
    link.click();
  }

  const handleShareAvatar = () => {
    window.open('https://www.facebook.com', '_blank');
    handleDownloadAvatar();
  }

  const handleShareCard = () => {
    window.open('https://www.facebook.com', '_blank');
    handleDownloadCard();
  }


  return (
    <Stack flexGrow={1}>
      <Stack alignItems='center' justifyContent='center' gap={2}>
        <Stack flexDirection={{ xs: 'column', md: 'row' }} alignItems='center' justifyContent='center' gap={{ xs: 10, md: 30 }}>
          <Stack alignItems='center' justifyContent='center' gap={3}>
            <img
              className='md:w-[35vh] w-[50vw] rounded-2xl'
              src={finalAvatarImage}
              alt="frame-avatar"
              draggable={false}
            />
            <Stack gap={1} display={{ xs: 'flex', md: 'none' }}>
              <button
                onClick={handleDownloadAvatar}
                className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
              >
                Tải về
              </button>
              <button
                onClick={handleShareAvatar}
                className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
              >
                Khoe ngay
              </button>
              <button
                onClick={handleBack}
                className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
              >
                Tạo ảnh khác
              </button>
            </Stack>
          </Stack>
          <Stack alignItems='center' justifyContent='center' gap={3}>
            <img
              className='md:w-[35vh] w-[50vw] rounded-2xl'
              src={finalCardImage}
              alt="frame-card"
              draggable={false}
            />
            <Stack gap={1} display={{ xs: 'flex', md: 'none' }}>
              <button
                onClick={handleDownloadCard}
                className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
              >
                Tải về
              </button>
              <button
                onClick={handleShareCard}
                className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
              >
                Khoe ngay
              </button>
              <button
                onClick={handleBack}
                className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
              >
                Tạo ảnh khác
              </button>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction='row' alignItems='center' justifyContent='center' gap={30} display={{ xs: 'none', md: 'flex' }}>
          <Stack gap={1}>
            <button
              onClick={handleDownloadAvatar}
              className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
            >
              Tải về
            </button>
            <button
              onClick={handleShareAvatar}
              className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
            >
              Khoe ngay
            </button>
            <button
              onClick={handleBack}
              className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
            >
              Tạo ảnh khác
            </button>
          </Stack>
          <Stack gap={1}>
            <button
              onClick={handleDownloadCard}
              className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
            >
              Tải về
            </button>
            <button
              onClick={handleShareCard}
              className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
            >
              Khoe ngay
            </button>
            <button
              onClick={handleBack}
              className='mt-2 cursor-pointer text-white bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-xl rounded-4xl px-21 py-3 z-101 border-2 border-white'
            >
              Tạo ảnh khác
            </button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default FinalResult