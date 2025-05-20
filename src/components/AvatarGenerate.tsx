import { Stack, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarBlankIcon, ImageIcon, UserIcon } from '@phosphor-icons/react';
import { differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import frameAvatar from '../assets/frame-avatar.png';
import frameCard from '../assets/frame-card.png';

const AvatarGenerate = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [finalAvatarImage, setFinalAvatarImage] = useState<string | null>(null);
  const [finalCardImage, setFinalCardImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [joinDate, setJoinDate] = useState<Date | null>(null);
  const [avatarPosition, setAvatarPosition] = useState({ x: 0, y: 0 });
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'avatar' | 'card' | null>(null);
  const [open, setOpen] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);

  // Cache loaded images
  const loadedImagesRef = useRef<{
    avatar?: HTMLImageElement;
    card?: HTMLImageElement;
    frameAvatar?: HTMLImageElement;
    frameCard?: HTMLImageElement;
  }>({});

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAvatarPosition({ x: 0, y: 0 });
        setCardPosition({ x: 0, y: 0 });
        lastPositionRef.current = { x: 0, y: 0 };
        // Clear cached images when new image is uploaded
        loadedImagesRef.current = {};
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'avatar' | 'card') => {
    if (!selectedImage) return;

    setIsDragging(true);
    setDragType(type);
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastPositionRef.current = type === 'avatar' ? avatarPosition : cardPosition;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragType || !selectedImage) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    if (dragType === 'avatar') {
      setAvatarPosition({
        x: lastPositionRef.current.x + dx,
        y: lastPositionRef.current.y + dy
      });
    } else {
      setCardPosition({
        x: lastPositionRef.current.x + dx,
        y: lastPositionRef.current.y + dy
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || !dragType) return;

    if (dragType === 'avatar') {
      lastPositionRef.current = avatarPosition;
    } else {
      lastPositionRef.current = cardPosition;
    }

    setIsDragging(false);
    setDragType(null);
  };

  // Load images once
  useEffect(() => {
    if (selectedImage && !loadedImagesRef.current.avatar) {
      const avatarImg = new Image();
      avatarImg.src = selectedImage;
      avatarImg.onload = () => {
        loadedImagesRef.current.avatar = avatarImg;
        // Trigger initial render
        setAvatarPosition(prev => ({ ...prev }));
      };

      const cardImg = new Image();
      cardImg.src = selectedImage;
      cardImg.onload = () => {
        loadedImagesRef.current.card = cardImg;
        // Trigger initial render
        setCardPosition(prev => ({ ...prev }));
      };
    }

    if (!loadedImagesRef.current.frameAvatar) {
      const frameAvatarImg = new Image();
      frameAvatarImg.src = frameAvatar;
      frameAvatarImg.onload = () => {
        loadedImagesRef.current.frameAvatar = frameAvatarImg;
        // Trigger initial render
        setAvatarPosition(prev => ({ ...prev }));
      };
    }

    if (!loadedImagesRef.current.frameCard) {
      const frameCardImg = new Image();
      frameCardImg.src = frameCard;
      frameCardImg.onload = () => {
        loadedImagesRef.current.frameCard = frameCardImg;
        // Trigger initial render
        setCardPosition(prev => ({ ...prev }));
      };
    }
  }, [selectedImage]);

  // Draw avatar
  useEffect(() => {
    if (!avatarCanvasRef.current || !loadedImagesRef.current.avatar || !loadedImagesRef.current.frameAvatar) return;

    const canvas = avatarCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    const img = loadedImagesRef.current.avatar;
    const scale = Math.min(300 / img.width, 300 / img.height) + 0.25;
    const x = (300 - img.width * scale) / 2 + avatarPosition.x;
    const y = (300 - img.height * scale) / 2 + avatarPosition.y;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // Draw frame
    ctx.drawImage(loadedImagesRef.current.frameAvatar, 0, 0, 300, 300);

    setFinalAvatarImage(canvas.toDataURL('image/png'));
  }, [avatarPosition]);

  // Draw card
  useEffect(() => {
    if (!cardCanvasRef.current || !loadedImagesRef.current.card || !loadedImagesRef.current.frameCard) return;

    const canvas = cardCanvasRef.current;
    const ctx = canvas.getContext('2d');
    console.log(ctx);
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 900;

    const img = loadedImagesRef.current.card;
    const scale = Math.min(300 / img.width, 300 / img.height) + 0.25;
    const x = (500 - img.width * scale) / 2 + cardPosition.x;
    const y = (600 - img.height * scale) / 2 + cardPosition.y;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // Draw frame
    ctx.drawImage(loadedImagesRef.current.frameCard, 0, 0, 500, 900);

    if (userName) {
      ctx.font = 'italic bold 32px Inter';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.fillText(userName, 172, 522);
    }

    if (joinDate) {
      const currentDate = new Date();
      const hourDiff = 24 * Number(differenceInDays(currentDate, joinDate));

      ctx.font = 'italic bold 48px Inter';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(`${hourDiff > 0 ? hourDiff : 0} giờ`, 242, 640);

    }
    setFinalCardImage(canvas.toDataURL('image/png'));
  }, [cardPosition, userName, joinDate]);

  const handleDownload = () => {
    if (finalAvatarImage && finalCardImage) {
      // Download Avatar
      const avatarLink = document.createElement('a');
      avatarLink.href = finalAvatarImage;
      avatarLink.download = 'avatar.png';
      document.body.appendChild(avatarLink);
      avatarLink.click();
      document.body.removeChild(avatarLink);

      // Download Card
      const cardLink = document.createElement('a');
      cardLink.href = finalCardImage;
      cardLink.download = 'card.png';
      document.body.appendChild(cardLink);
      cardLink.click();
      document.body.removeChild(cardLink);
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Stack zIndex={101} py={4}>
        <Stack gap={4} direction={{ xs: 'column', md: 'row' }}>
          <Stack alignItems='center' justifyContent='center' gap={4}>
            <div
              ref={containerRef}
              className={`relative ${selectedImage ? 'cursor-move' : ''}`}
              onMouseDown={(e) => handleMouseDown(e, 'avatar')}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <img
                className='w-[300px] h-[300px] rounded-2xl'
                src={finalAvatarImage || frameAvatar}
                alt="frame-avatar"
                draggable={false}
              />
              <canvas ref={avatarCanvasRef} style={{ display: 'none' }} />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <Stack gap={3}>
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                sx={{
                  borderBottom: '1px solid white',
                  width: 500,
                  pb: 1,
                  px: 1,
                  cursor: 'pointer'
                }}
                onClick={handleClick}
              >
                <Typography sx={{ fontSize: 18, fontWeight: 300, fontFamily: 'Unbounded', color: 'white' }}>Upload ảnh</Typography>
                <ImageIcon size={26} color='white' weight="fill" />
              </Stack>

              <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ borderBottom: '1px solid white', width: 500, pb: 1, px: 1 }}>
                <TextField
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  variant="standard"
                  slotProps={{
                    input: {
                      disableUnderline: true,
                      style: {
                        fontSize: 18,
                        fontWeight: 300,
                        fontFamily: 'Unbounded',
                        color: 'white',
                        width: '100%',
                      },
                      autoComplete: 'off'
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        opacity: 1
                      }
                    }
                  }}
                />
                <UserIcon size={26} color='white' weight="fill" />
              </Stack>

              <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ borderBottom: '1px solid white', width: 500, pb: 1, px: 1 }}>
                <DatePicker
                  value={joinDate}
                  onChange={(newValue) => setJoinDate(newValue)}
                  slots={{
                    openPickerIcon: () => <CalendarBlankIcon size={26} color='white' weight="fill" />,
                  }}
                  onOpen={() => setOpen(true)}
                  onClose={() => setOpen(false)}
                  label={!open || joinDate ? 'Ngày gia nhập' : ''}
                  slotProps={{
                    textField: {
                      variant: 'standard',
                      InputProps: {
                        disableUnderline: true,
                        style: {
                          fontSize: 18,
                          fontWeight: 300,
                          fontFamily: 'Unbounded !important',
                          color: 'white',
                          width: 490,
                        }
                      },
                      sx: {
                        '& .MuiInputBase-input': {
                          color: 'white',
                          fontFamily: 'Unbounded',
                          fontSize: 18,
                          fontWeight: 300,
                        },
                        '& .MuiOutlinedInput-input': {
                          fontFamily: 'Unbounded',
                          fontSize: 18,
                          fontWeight: 300,
                        },
                        '& .MuiPickersInputBase-root': {
                          '& .MuiPickersSectionList-root ': {
                            '& .MuiPickersSectionList-section': {
                              '& .MuiPickersSectionList-sectionContent': {
                                fontFamily: 'Unbounded',
                                fontSize: 18,
                                fontWeight: 300,
                              }
                            }
                          }
                        },
                        '& .MuiFormLabel-root': {
                          color: 'white',
                          fontSize: 18,
                          fontWeight: 300,
                          fontFamily: 'Unbounded',
                          '&.Mui-focused': {
                            color: 'white'
                          }
                        },
                      }
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      color: 'white'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                  }}
                />
              </Stack>
            </Stack>

            <button
              className='mt-2 cursor-pointer text-white font-bold bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-2xl rounded-4xl px-30 py-3 z-101'
              onClick={handleDownload}
            >
              Tải xuống
            </button>
          </Stack>

          <Stack>
            <div
              className={selectedImage ? 'cursor-move' : ''}
              onMouseDown={(e) => handleMouseDown(e, 'card')}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <img className='w-[500px] h-[900px] rounded-2xl' src={finalCardImage || frameCard} alt="frame-card" draggable={false} />
              <canvas ref={cardCanvasRef} style={{ display: 'none' }} />
            </div>
          </Stack>
        </Stack>
      </Stack>
    </LocalizationProvider>
  )
}

export default AvatarGenerate