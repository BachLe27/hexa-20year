import { Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarBlankIcon, ImageIcon, UserIcon } from '@phosphor-icons/react';
import { differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import frameAvatar from '../assets/frame-avatar.png';
import frameCard from '../assets/frame-card.png';
import FinalResult from './FinalResult';

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
  const [isSubmit, setIsSubmit] = useState(false);

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

  const handleTouchStart = (e: React.TouchEvent, type: 'avatar' | 'card') => {
    if (!selectedImage) return;

    setIsDragging(true);
    setDragType(type);
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    lastPositionRef.current = type === 'avatar' ? avatarPosition : cardPosition;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragType || !selectedImage) return;

    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;

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

  const handleTouchEnd = () => {
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

    canvas.width = 1080;
    canvas.height = 1080;

    const img = loadedImagesRef.current.avatar;
    // Calculate scale to fit the image within the frame while maintaining aspect ratio
    const frameSize = 1080;
    const scale = Math.min(frameSize / img.width, frameSize / img.height) + 0.15;

    // Calculate dimensions to center the image
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const x = (frameSize - scaledWidth) / 2 + avatarPosition.x * 2;
    const y = (frameSize - scaledHeight) / 2 + avatarPosition.y * 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Draw image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

    // Draw frame
    ctx.drawImage(loadedImagesRef.current.frameAvatar, 0, 0, 1080, 1080);

    setFinalAvatarImage(canvas.toDataURL('image/png', 1.0));
  }, [avatarPosition]);

  // Draw card
  useEffect(() => {
    if (!cardCanvasRef.current || !loadedImagesRef.current.frameCard) return;

    const canvas = cardCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 1800;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image if exists
    if (loadedImagesRef.current.card) {
      const img = loadedImagesRef.current.card;
      // Calculate scale to fit the image within the card frame while maintaining aspect ratio
      const frameWidth = 1000;
      const frameHeight = 1200;
      const scale = Math.min(frameWidth / img.width, frameHeight / img.height);

      // Calculate dimensions to center the image
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (frameWidth - scaledWidth) / 2 + cardPosition.x * 2;
      const y = (frameHeight - scaledHeight) / 2 + cardPosition.y * 2;

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Draw frame
    ctx.drawImage(loadedImagesRef.current.frameCard, 0, 0, 1000, 1800);

    if (userName) {
      ctx.font = 'italic bold 62px Montserrat';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(userName, 492, 990);
    }

    if (joinDate) {
      const currentDate = new Date();
      const hourDiff = 24 * Number(differenceInDays(currentDate, joinDate));

      ctx.font = 'italic bold 96px Montserrat';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(`${hourDiff > 0 ? hourDiff : 0} giờ`, 504, 1200);
    }
    setFinalCardImage(canvas.toDataURL('image/png', 1.0));
  }, [cardPosition, userName, joinDate]);

  const handleSubmit = () => {
    if (!finalAvatarImage || !finalCardImage) return;

    setIsSubmit(true);
  }

  const theme = useTheme();
  const isDownMd = useMediaQuery(theme.breakpoints.down('md'));


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Stack fontFamily='Montserrat' zIndex={101} py={4} alignItems='center' justifyContent='center' width='100vw' overflow='hidden' minHeight='100vh'>
        <Stack gap={10} direction={{ xs: 'column', md: 'row' }}>
          {!isSubmit && (
            <>
              <Stack alignItems='center' justifyContent='center' gap={4}>
                <div
                  ref={containerRef}
                  className={`relative ${selectedImage ? 'cursor-move' : ''}`}
                  onMouseDown={(e) => handleMouseDown(e, 'avatar')}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={(e) => handleTouchStart(e, 'avatar')}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
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

                <Stack gap={3} mt={2} justifyContent='center' alignItems='center'>
                  <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{
                      borderBottom: '1px solid white',
                      width: { xs: 300, md: 500 },
                      pb: 1,
                      px: 1,
                      cursor: 'pointer'
                    }}
                    onClick={handleClick}
                  >
                    <Typography sx={{ fontSize: 18, fontWeight: 300, fontFamily: 'Unbounded', color: 'white' }}>Upload ảnh</Typography>
                    <ImageIcon size={26} color='white' weight="fill" />
                  </Stack>

                  <Stack
                    direction='row' alignItems='center' justifyContent='space-between'
                    sx={{ borderBottom: '1px solid white', width: { xs: 300, md: 500 }, pb: 1, px: 1, mt: 1.5 }}
                  >
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

                  <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ borderBottom: '1px solid white', width: { xs: 300, md: 500 }, pb: 1, px: 1 }}>
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
                              width: isDownMd ? '290px' : '490px',
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
                  className='mt-3 cursor-pointer text-white font-bold bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-2xl rounded-4xl px-20 md:px-30 py-3 z-101 border-2 border-white'
                  onClick={handleSubmit}
                >
                  Hoàn thành
                </button>
              </Stack>

              <Stack alignItems='center' justifyContent='center'>
                <div
                  className={selectedImage ? 'cursor-move' : ''}
                  onMouseDown={(e) => handleMouseDown(e, 'card')}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={(e) => handleTouchStart(e, 'card')}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <img className='w-[300px] h-[540px] rounded-2xl md:w-[500px] md:h-[900px]' src={finalCardImage || frameCard} alt="frame-card" draggable={false} />
                  <canvas ref={cardCanvasRef} style={{ display: 'none' }} />
                </div>
              </Stack>
            </>
          )}
          {isSubmit && finalAvatarImage && finalCardImage && (
            <FinalResult finalAvatarImage={finalAvatarImage} finalCardImage={finalCardImage} handleBack={() => setIsSubmit(false)} />
          )}
        </Stack>
      </Stack>
    </LocalizationProvider >
  )
}

export default AvatarGenerate