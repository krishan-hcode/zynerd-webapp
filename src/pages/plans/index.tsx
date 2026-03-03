import Illustrations from '@/elements/Illustrations';
import withAuth from '@/global/WithAuth';
import {ChevronRightIcon} from '@heroicons/react/24/outline';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import middlegroundIllustration from '../../../public/assets/Middleground.png';
import notesIllustration from '../../../public/assets/notes.png';
import womenIllustration from '../../../public/assets/women.png';

const PLAN_OPTIONS = [
  {
    heading1: 'Online Plans',
    heading2: 'With or Without Notes',
    path: '/plans/premium-packages',
    imageSrc: middlegroundIllustration,
  },
  {
    heading1: 'Offline',
    heading2: 'Events',
    path: '/plans/offline-events',
    imageSrc: womenIllustration,
  },
  {
    heading1: 'Notes',
    heading2: 'Only',
    path: '/plans/only-notes',
    imageSrc: notesIllustration,
  },
];

const Plans = () => {
  return (
    <div className="relative pb-6 md:pb-24 bg-slate-100 min-h-screen ">
      <Illustrations />
      <Head>
        <title>Plans – Cerebellum Academy</title>
      </Head>
      <h1 className="h-36 md:h-44 xl:h-64 pt-10 rounded-bl-[5rem] xl:rounded-bl-full bg-[#143057] text-white text-4xl xl:text-5xl md:pb-10  md:leading-[3.5rem] font-inter pb-6 font-semibold tracking-tight text-center">
        Which One You Want To Go For
      </h1>
      <div className="bg-[#143057]">
        <div className="bg-slate-100 rounded-tr-[5rem] xl:rounded-tr-[15rem] z-30 md:pt-20">
          <div className="relative rounded-xl py-24 sm:py-32 mx-auto md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mx-2 sm:mx-0">
              {PLAN_OPTIONS.map(({imageSrc, heading1, heading2, path}) => (
                <Link
                  href={path}
                  key={heading1}
                  className="relative group flex justify-between border border-slate-300 bg-[#D6E7FF] rounded-lg ">
                  <div className="pl-8 flex flex-col justify-center text-[#143057]">
                    <h3 className="font-semibold text-2xl md:text-4xl">
                      {heading1}
                    </h3>
                    <p className="font-light text-[14px] md:text-xl">
                      {heading2}
                    </p>
                    <button className="absolute -bottom-3 bg-gradient-to-b from-[#24B0E6] to-[#4469B3] rounded-md px-2 py-1 text-white">
                      Explore More...
                    </button>
                  </div>
                  <div className="flex">
                    <Image
                      alt={heading1}
                      width={200}
                      height={200}
                      src={imageSrc}
                      className="w-44"
                    />
                    <ChevronRightIcon className="hidden xl:block duration-500 opacity-0 group-hover:opacity-100 w-6 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Plans);
