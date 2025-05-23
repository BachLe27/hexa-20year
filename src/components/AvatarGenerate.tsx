import { Slider, Stack, SvgIcon, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarBlankIcon, ImageIcon, MinusIcon, PlusIcon, UserIcon } from '@phosphor-icons/react';
import { differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Stage as StageType } from 'konva/lib/Stage';
import { Image as KonvaImage, Layer, Stage, Text } from 'react-konva';
import useImage from 'use-image';
import frameAvatarImage from '../assets/frame-avatar.png';
import frameCardImage from '../assets/frame-card.png';
import FinalResult from './FinalResult';

const AvatarGenerate = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [userName, setUserName] = useState('');
  const [joinDate, setJoinDate] = useState<Date | null>(null);
  const [hours, setHours] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [scale, setScale] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);



  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const [avatarImage] = useImage(selectedImage!);

  useEffect(() => {

  }, [selectedImage]);

  const handleClick = () => {
    fileInputRef.current?.click();
  }

  const [frameAvatar] = useImage(frameAvatarImage);
  const [frameCard] = useImage(frameCardImage);

  const theme = useTheme();
  const isDownMd = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (joinDate) {
      const currentDate = new Date();
      const hourDiff = 24 * Number(differenceInDays(currentDate, joinDate));
      if (hourDiff > 0) {
        setHours(`${hourDiff} giờ`);
      } else {
        setHours(`0 giờ`);
      }
    } else {
      setHours(null);
    }
  }, [joinDate]);

  const finalAvatarRef = useRef<StageType>(null);
  const finalCardRef = useRef<StageType>(null);

  const [finalAvatarImage, setFinalAvatarImage] = useState<string | null>(null);
  const [finalCardImage, setFinalCardImage] = useState<string | null>(null);

  const handleBack = () => {
    setIsSubmit(false);
  }

  const handleSubmit = () => {
    // Create a temporary canvas with border radius
    const avatarCanvas = document.createElement('canvas');
    const cardCanvas = document.createElement('canvas');

    // Set canvas dimensions
    avatarCanvas.width = 300;
    avatarCanvas.height = 300;
    cardCanvas.width = 500;
    cardCanvas.height = 900;

    // Get contexts
    const avatarCtx = avatarCanvas.getContext('2d');
    const cardCtx = cardCanvas.getContext('2d');

    if (avatarCtx && cardCtx) {
      // Draw with border radius
      avatarCtx.beginPath();
      avatarCtx.roundRect(0, 0, 300, 300, 16);
      avatarCtx.clip();
      avatarCtx.drawImage(finalAvatarRef.current!.toCanvas(), 0, 0);

      cardCtx.beginPath();
      cardCtx.roundRect(0, 0, 500, 900, 16);
      cardCtx.clip();
      cardCtx.drawImage(finalCardRef.current!.toCanvas(), 0, 0);

      setFinalAvatarImage(avatarCanvas.toDataURL());
      setFinalCardImage(cardCanvas.toDataURL());
    }

    setIsSubmit(true);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Stack fontFamily='Montserrat' zIndex={101} py={4} alignItems='center' justifyContent='center' width='100vw' overflow='hidden' minHeight='100vh'>
        <Stack gap={10} direction={{ xs: 'column', md: 'row' }}>
          {!isSubmit && (
            <>
              <Stack alignItems='center' justifyContent='center' gap={4}>

                <Stack width={300} height={300} className='rounded-2xl border-2 border-white overflow-hidden'>
                  <Stage ref={finalAvatarRef} width={300} height={300}>
                    <Layer>
                      <KonvaImage
                        image={avatarImage}
                        // width={300}
                        // height={300}
                        x={0}
                        y={0}
                        scaleX={0.1 + scale / 100}
                        scaleY={0.1 + scale / 100}
                        draggable
                        onMouseEnter={() => {
                          if (selectedImage) {
                            document.body.style.cursor = 'move';
                          }
                        }}
                        onMouseLeave={() => {
                          document.body.style.cursor = 'default';
                        }}
                      />
                      <KonvaImage width={300} height={300} image={frameAvatar} listening={false} />
                    </Layer>
                  </Stage>
                </Stack>

                <Stack width={isDownMd ? '290px' : '100%'} direction='row' alignItems='center' justifyContent='center' gap={2}>
                  <SvgIcon>
                    <MinusIcon fill='white' />
                  </SvgIcon>
                  <Slider
                    size="small"
                    value={scale}
                    onChange={(_, value) => setScale(value)}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    sx={{
                      color: 'white',
                      '& .MuiSlider-thumb': {
                        color: 'white',
                        '&:focus, &:hover, &.Mui-active': {
                          boxShadow: 'none'
                        },
                      },
                      '& .MuiSlider-track': {
                        color: 'white',
                      },
                      '& .MuiSlider-valueLabel': {
                        display: 'none',
                      },
                      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                        boxShadow: 'none',
                      },

                    }}
                  />
                  <SvgIcon>
                    <PlusIcon fill='white' />
                  </SvgIcon>
                </Stack>

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

              <Stack alignItems='center' justifyContent='center' className='border-2 border-white rounded-2xl overflow-hidden'>
                <Stage ref={finalCardRef} width={500} height={900}>
                  <Layer>
                    <KonvaImage
                      x={110}
                      y={140}
                      scaleX={0.1 + scale / 100 - 0.008}
                      scaleY={0.1 + scale / 100 - 0.008}
                      image={avatarImage}
                      draggable
                      onMouseEnter={() => {
                        document.body.style.cursor = 'move';
                      }}
                      onMouseLeave={() => {
                        document.body.style.cursor = 'default';
                      }} />
                    <KonvaImage width={500} height={900} image={frameCard} listening={false} />

                    <Text
                      x={20}
                      y={494}
                      text={userName}
                      fontSize={32}
                      fontFamily="Montserrat"
                      fill="white"
                      align='center'
                      fontStyle='italic bold'
                      width={460}
                    />

                    <Text
                      x={20}
                      y={570}
                      text={hours || ''}
                      fontSize={40}
                      fontFamily="Montserrat"
                      fill="white"
                      align='center'
                      fontStyle='italic bold'
                      width={460}
                    />
                  </Layer>
                </Stage>
              </Stack>
            </>
          )}
          {isSubmit && finalAvatarImage && finalCardImage && (
            <FinalResult
              finalAvatarImage={finalAvatarImage}
              finalCardImage={finalCardImage}
              handleBack={handleBack}
            />
          )}
        </Stack>
      </Stack>
    </LocalizationProvider >
  )
}

export default AvatarGenerate