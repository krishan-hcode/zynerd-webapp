import {useState} from 'react';
import type {Swiper as SwiperType} from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import {Autoplay, Pagination} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

import Image from 'next/image';
import carousel1 from '../../public/assets/loginCarouselSlide_1.svg';
import carousel2 from '../../public/assets/loginCarouselSlide_2.svg';
import carousel3 from '../../public/assets/loginCarouselSlide_3.svg';

const CarouselSection = () => {
  const slides = [
    {
      img: carousel1,
      title: 'Learn from the best',
      subtitle: 'All your favorite teachers in one place.',
    },
    {
      img: carousel2,
      title: 'Master your passion',
      subtitle:
        'Content curated by the faculty themselves to ensure you study exactly what is needed.',
    },
    {
      img: carousel3,
      title: 'Personalized Learning',
      subtitle:
        'Get custom modules, subjects tests and Q-Bank linked to the video modules.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex h-full flex-col rounded-2xl bg-[#EFF8FD] py-2 md:py-8 px-8 relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 3000, // 3 seconds between slides
          disableOnInteraction: false, // keeps autoplay after user swipes
        }}
        pagination={{
          el: '.custom-pagination',
          clickable: true,
          renderBullet: (index: number, className: string): string => {
            return `<span class="${className} custom-bullet"></span>`;
          },
        }}
        loop={true}
        onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
        className="flex w-48 md:w-96  md:mt-12 relative">
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="flex flex-col items-center justify-center h-full">
            <div className="mb-4 md:mb-8">
              <Image
                src={slide.img}
                alt="illustration"
                className="h-36 md:h-auto w-full object-contain"
              />
            </div>

            {/* </div> */}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex flex-col md:mt-auto text-center md:text-left px-2 md:px-0">
        <div className="custom-pagination mb-3  "></div>

        <h2 className="text-xl md:text-2xl font-mincho font-normal text-primary-dark">
          {slides[activeIndex].title}
        </h2>
        <p className="text-sm font-inter text-customGray-80 font-medium mb-6 mt-3">
          {slides[activeIndex].subtitle}
        </p>
        <p className="text-xs font-inter text-customGray-80 font-medium">
          Facing issues in App,{' '}
          <a
            href="https://www.cerebellumacademy.com/contact-us/"
            className="text-xs font-inter font-medium text-blue-500">
            Contact Us
          </a>
        </p>
      </div>

      {/* Custom styles for bullets */}
      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 24px;
          height: 4px;
          border-radius: 4px !important;
          background: #d1d5db; /* gray-300 */
          opacity: 1;
          margin: 0 4px !important;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #2563eb; /* blue-600 */
        }
      `}</style>
    </div>
  );
};

export default CarouselSection;
