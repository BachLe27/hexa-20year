import { useEffect } from 'react';

const PreloadImages = () => {
  useEffect(() => {
    const urls = [
      'src/assets/frame-avatar.png',
      'src/assets/frame-card.png'
    ];

    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  return null; // không hiển thị gì
};

export default PreloadImages;
