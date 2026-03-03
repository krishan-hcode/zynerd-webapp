import Image from 'next/image';

import circleIllustration from '../../public/assets/circleIllustration.png';
import doctorIllustration from '../../public/assets/doctorGroupIllustration.png';

const Illustrations = ({
  hideDoctorIllustration = false,
}: {
  hideDoctorIllustration?: boolean;
}) => {
  return (
    <>
      {!hideDoctorIllustration && (
        <Image
          width={480}
          height={480}
          alt="doctor-illustration"
          src={doctorIllustration}
          priority={true}
          className="right-0 bottom-0 absolute w-[200px] md:w-[320px] lg:w-[370px] xl:w-[440px]"
        />
      )}
      <Image
        width={400}
        height={400}
        alt="circle-illustration"
        src={circleIllustration}
        className="right-0 top-0 absolute w-[180px] md:w-[200px] lg:w-[270px] xl:w-[400px]"
      />
      <Image
        width={400}
        height={400}
        alt="circle-illustration"
        src={circleIllustration}
        className="left-0 bottom-0 rotate-180 absolute w-[180px] md:w-[200px] lg:w-[270px] xl:w-[400px] pointer-events-none"
      />
    </>
  );
};

export default Illustrations;
