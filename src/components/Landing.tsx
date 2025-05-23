
import logo from '../assets/logo.png'
import logo2 from '../assets/logo_hexa_20.png'
import { useState, useEffect } from 'react';
import { motion, useMotionValue } from "motion/react"

const Landing = ({ nextStep }: { nextStep: () => void }) => {
  const [isStart, setIsStart] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const scrollPosition = useMotionValue(0)
  const [numberOfAnimationsComplete, setNumberOfAnimationsComplete] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleStart = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsStart(true);
      setIsScrolling(true);
    }, 500);
  };

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number;
    const totalYears = 27;
    const totalDistance = 120 * (totalYears - 1);
    const duration = 1000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress >= duration) {
        startTime = timestamp;
      }

      const newPosition = -((progress / duration) * totalDistance);

      if (Math.abs(newPosition) >= totalDistance) {
        scrollPosition.set(-totalDistance);
        setIsScrolling(false);
        // setAllAnimationsComplete(true);
        console.log('all animations complete');
        return;
      }

      scrollPosition.set(newPosition);

      if (isScrolling) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (isScrolling) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrolling]);


  useEffect(() => {
    if (numberOfAnimationsComplete === 2) {
      setTimeout(() => {
        nextStep();
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfAnimationsComplete]);

  return (
    <div className='flex flex-col items-center gap-12'>
      <div className='flex flex-col flex-1 w-full items-center mt-6'>
        <img className='w-54 sm:w-54 md:w-70 h-auto' src={logo} alt="logo" />
      </div>
      {
        !isStart && (
          <div className={`flex flex-col flex-1 w-full items-center transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
            <img className='w-[90vw] sm:w-[50vh] sm:h-[25vh] md:w-[60vh] md:h-[30vh] lg:w-[70vh] lg:h-[35vh] xl:w-[80vh] xl:h-[40vh] 2xl:w-[90vh] 2xl:h-[45vh] object-contain' src={logo2} alt="logo2" />
          </div>
        )
      }
      {
        !isStart && (
          <div className={`z-1 gradient-box transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`} onClick={handleStart}>
            <button className='z-2 cursor-pointer text-white font-bold bg-gradient-to-r from-[#D9442B] to-[#B91F32] text-2xl rounded-4xl px-20 md:px-30 py-3'>
              Bắt đầu
            </button>
          </div>
        )
      }
      {
        isStart && (
          <div>
            <div className="flex flex-col gap-2 items-center text-center font-unbounded text-white text-2xl text-xl sm:text-3xl md:text-3xl lg:text-5xl font-semibold">
              <span style={{ fontFamily: 'Montserrat !important' }} className='block md:hidden'>CHÀO MỪNG</span>
              <span style={{ fontFamily: 'Montserrat !important' }} className='block md:hidden'>ĐẾN VỚI HEXA 20 NĂM</span>
              <span style={{ fontFamily: 'Montserrat !important' }} className='hidden md:block'>CHÀO MỪNG ĐẾN VỚI HEXA 20 NĂM</span>
              <span>TỪ TÂM VƯƠN TẦM</span>
            </div>

            <div className="w-[100%] bg-transparent rounded-lg mt-4 h-72 relative overflow-hidden">
              <div className="flex flex-col gap-4 justify-center items-center">
                <div className="relative justify-center items-center my-auto top-16">
                  <div className="flex items-center">
                    <motion.div
                      className="flex flex-col year gap-[80px] w-[1000px]"
                      animate={{
                        y: scrollPosition.get(),
                        transition: {
                          duration: 3,
                        }
                      }}
                      onAnimationComplete={() => {
                        setNumberOfAnimationsComplete(numberOfAnimationsComplete + 1);
                      }}
                    >
                      <span></span>
                      {Array.from({ length: 21 }, (_, i) => 2005 + i).map((year) => {
                        if (year === 2005) {
                          return (
                            <motion.div
                              key={year}
                              className={`text-[48px] antialiased  text-[#b91f32] text-shadow font-extrabold text-center items-center justify-center flex transition-all duration-500`}
                              initial={{
                                scale: 0.5,
                              }}
                              animate={{
                                scale: 0.8,
                              }}
                              transition={{
                                duration: 0.3,
                              }}
                            >
                              {year}
                            </motion.div>
                          )
                        }

                        if (year === 2025) {
                          return (
                            <motion.div
                              key={year}
                              className={`text-[48px] antialiased text-[#b91f32] text-shadow font-extrabold text-center items-center justify-center flex transition-all duration-500`}
                              initial={{
                                scale: 1.205,
                              }}
                              animate={{
                                scale: 1.9,
                              }}
                              transition={{
                                duration: 0.8,
                              }}
                            >
                              {year}
                            </motion.div>
                          )
                        }


                        return (
                          <motion.div
                            key={year}
                            className={`text-[48px] antialiased text-[#b91f32] text-shadow font-extrabold text-center items-center justify-center flex transition-all duration-500`}
                            initial={{
                              scale: 0.8,
                            }}
                            animate={{
                              scale: 0.8 + (year - 2005) / 20,
                            }}
                            transition={{
                              duration: 1,
                              ease: "easeInOut"
                            }}

                          >
                            {year}
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  </div>
                </div>
              </div>

            </div>
          </div >
        )
      }
    </div>
  )
}

export default Landing