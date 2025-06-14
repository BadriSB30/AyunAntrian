import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ImageSlider = ({ images, currentImage, altPrefix = 'Image' }) => {
  const getPosition = (index) => {
    if (index === currentImage) return 'center';
    if (index === (currentImage - 1 + images.length) % images.length) return 'left';
    if (index === (currentImage + 1) % images.length) return 'right';
    return 'hidden';
  };

  return (
    <div className='relative w-full sm:w-[600px] h-[250px] sm:h-[400px] flex items-center justify-center overflow-hidden'>
      {images.map((src, index) => {
        const position = getPosition(index);

        let x = 0;
        let scale = 1;
        let opacity = 1;

        if (position === 'left') {
          x = '-100%';
          scale = 0.8;
          opacity = 0.5;
        } else if (position === 'right') {
          x = '100%';
          scale = 0.8;
          opacity = 0.5;
        } else if (position === 'hidden') {
          opacity = 0;
        }

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ x, scale, opacity }}
            transition={{ duration: 0.5 }}
            className='absolute w-full sm:w-[300px] h-full sm:h-[225px] max-w-[90%] max-h-[90%] rounded-xl overflow-hidden shadow-lg'
          >
            <Image
              src={src}
              alt={`${altPrefix}_${index + 1}`}
              layout='responsive'
              width={300}
              height={400}
              style={{ objectFit: 'cover' }}
              className='rounded-xl'
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default ImageSlider;
