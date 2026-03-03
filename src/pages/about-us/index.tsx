import Head from 'next/head';
import Image from 'next/image';
import AboutUs1 from '../../../public/assets/about_us_1.png';
import AboutUs2 from '../../../public/assets/about_us_2.png';
import Faculty1 from '../../../public/assets/faculty-1.png';
import Faculty2 from '../../../public/assets/faculty-2.png';
import Faculty3 from '../../../public/assets/faculty-3.png';
import Faculty4 from '../../../public/assets/faculty-4.png';
import Faculty5 from '../../../public/assets/faculty-5.png';

// Dummy faculty images array
const facultyList = [Faculty1, Faculty2, Faculty3, Faculty4, Faculty5];

const AboutUs = () => {
  return (
    <div>
      <Head>
        <title>About Us – Cerebellum Academy</title>
      </Head>
      {/* Heading */}
      <div>
        <div className="bg-cobalt h-[50vh] py-20 px-8 md:px-16">
          <p className="text-white text-sm">ABOUT US</p>
          <h1 className="text-4xl md:text-5xl md:leading-[3.5rem] font-inter  font-semibold text-white">
            We’re on a mission to empower
            <br /> students worldwide
          </h1>
        </div>
      </div>
      {/* Image section */}
      <div className="-mt-40 xl:flex justify-start px-8 md:px-16 pb-10 xl:space-x-6 space-y-6 xl:space-y-0">
        <div className="xl:w-1/4">
          <Image
            alt="about-us-1"
            className=" max-w-full h-full object-cover"
            src={AboutUs1}
          />
        </div>
        <div className="xl:w-3/4">
          <Image
            alt="about-us-2"
            className=" max-w-full h-full object-cover"
            src={AboutUs2}
          />
        </div>
      </div>
      {/* Our Story Section */}
      <div className="xl:flex px-8 md:px-16 pb-10 md:pb-20 xl:space-x-6 space-y-6 xl:space-y-0 font-inter">
        <h3 className="xl:w-1/4 text-black text-4xl md:text-5xl font-semibold">
          Our Story
        </h3>
        <div className="xl:w-3/4 paragraph-text">
          <p>
            Cerebellum academy provides best in class, top-notch teaching by
            best educators of India for Post graduate entrance exam/ NEXT exam.
            The combined teaching experience of the
          </p>
          <br />
          <p>
            entire faculty team crosses 100 plus years of wisdom and knowledge.
          </p>
          <br />
          <p>
            The face-to-face classes organized by Cerebellum academy are most
            sought after by students willing to get that extra cutting edge. The
            main agenda behind these classes is to give relevant, concise,
            revisable content to students.
          </p>
          <br />
          <p>
            In this competitive world there are no second chances and few MCQ
            going wrong can end hopes of a dream seat. Hence, we strive to push
            you so hard in our classes that you will be used to mental
            challenges and will fire you up till the very moment when the buzzer
            ofexam time is blown.
          </p>
        </div>
      </div>
      {/* our vision section */}
      <div className="md:flex space-y-6 md:space-y-0 md:space-x-6 px-8 md:px-16 pb-20">
        <div className="w-full md:w-1/2 paragraph-text">
          <h3 className="heading-text">Our Vision</h3>
          <p>
            Cerebellum academy, the best PG medical entrance exam academy is
            based on the vision to make medical information simplified and easy
            so that students fall in love with the subjects instead of dreading
            them.
          </p>
          <br />
          <p>
            Our NEXT exam coaching academy in Delhi wants to help medical
            students swim effortlessly in a vast ocean of medical knowledge. We
            are all about deep knowledge sea diving without medical students
            ever feeling intimidated by the vastness.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <h3 className="heading-text">Our Mission</h3>
          <p className="paragraph-text">
            We at the Cerebellum have been devoted to supporting medical
            professionals and MBBS students in getting a thorough grasp of
            medical education for different tests such as the FMGE (MCI)
            screening exam, the USMLE, the MBBS undergraduate exam, and the NEET
            PG exam along with the INI CET exam.
          </p>
        </div>
      </div>
      {/* Active students section */}
      <div className="px-8 lg:px-16 pb-10">
        <div className="flex flex-wrap justify-around px-8 xl:px-16 py-10 md:py-20 border-y-2">
          <div className="flex flex-col items-center">
            <p className="heading-text">2000+</p>
            <p className="paragraph-text mb-4">Active Students</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="heading-text">30+</p>
            <p className="paragraph-text">Faculty members</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="heading-text">2000+</p>
            <p className="paragraph-text">Active Students</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="heading-text">30+</p>
            <p className="paragraph-text">Faculty members</p>
          </div>
        </div>
      </div>
      {/* World class course section */}
      <div className="flex flex-wrap xl:flex-nowrap px-8 md:px-16 py-10 lg:py-20">
        <div className="w-full xl:w-1/2">
          <h3 className="heading-text">
            World-Class Course for Anyone, by World-Class Faculty
          </h3>
          <p className="paragraph-text">
            In this series, all 19 subjects are revised from Basics to Advanced.
            Each faculty also teaches tips and tricks on how to complete the
            course and most importantly with their experience they make you
            understand on how to give the exam.
          </p>
          <br />
          <p className="paragraph-text">
            During this course we provide one book known as the 20th Book. This
            is a workbook which is required during the class as the faculty
            keeps the book as a reference point during the class. This book is
            only available for the students who are attending the series and is
            not sold separately.
          </p>
        </div>
        <div className=" flex flex-col justify-center items-center">
          <div className="relative top-16 sm:top-28 xl:top-12 lg:left-40 z-10 h-40 w-40 sm:h-52 sm:w-52 bg-[#34C759] rounded-full">
            <p className="text-xs md:text-xs text-white absolute top-1/2 text-center -translate-y-1/2 w-full">
              Needs to know which <br />
              Topics to Revise
            </p>
          </div>
          <div className="relative -top-40 md:-top-44 xl:-top-60 lg:left-80 left-32 md:left-40 z-20 h-40 w-40 sm:h-52 sm:w-52 bg-cobalt rounded-full">
            <p className="text-xs md:text-xs text-white absolute top-1/2 text-center -translate-y-1/2 w-full">
              Revise Again
            </p>
          </div>
          <div className="relative z-30 -top-48 md:-top-56 xl:-top-72 lg:left-80 left-32 md:left-40 h-40 w-40 sm:h-52 sm:w-52 bg-[#141236] rounded-full">
            <p className="text-xs md:text-xs text-white absolute top-1/2 text-center -translate-y-1/2 w-full">
              For the last minute <br />
              revision
            </p>
          </div>
        </div>
      </div>
      {/* Meet Our professionals section */}
      <div className="-mt-56 px-8 md:px-16 bg-[#fbfcff]">
        <div className="py-10 md:py-20 text-black ">
          <p className=" text-sm">FACULTIES</p>
          <h1 className="text-4xl md:text-5xl md:leading-[3.5rem] font-inter  font-semibold">
            Meet our professional and
            <br /> experience Faculty in here
          </h1>
        </div>
        <div>
          {Array(4)
            .fill('')
            .map((value, index) => {
              return (
                <div
                  className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                  key={index}>
                  {facultyList.map((imageSrc, idx) => {
                    return (
                      <div
                        className="mb-8 md:mb-12"
                        key={imageSrc + idx.toString()}>
                        <Image
                          className="pr-2 md:pr-4 w-full md:w-full mb-4 object-cover"
                          alt={'faculty-' + idx}
                          src={imageSrc}
                        />
                        <p>Olivia Rhye</p>
                        <p className="text-cobalt">Founder & CEO</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
