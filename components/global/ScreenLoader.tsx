import {PuffLoader} from 'react-spinners';

const ScreenLoader = () => {
  return (
    <div className="absolute top-0 left-0 h-screen flex justify-center items-center w-full bg-gray-100 bg-opacity-100">
      <PuffLoader size={80} color="#376FEF" />
    </div>
  );
};

export default ScreenLoader;
