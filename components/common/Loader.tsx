import React from 'react';
import {RingLoader} from 'react-spinners';

const Loader = ({
  children,
  isLoading = false,
}: {
  children: React.ReactNode;
  isLoading: boolean;
}) => {
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-zinc-900 z-[70] overflow-hidden w-full h-full bg-opacity-50">
          <RingLoader
            className=" absolute z-[90] top-[45vh] left-1/2 right-1/2 -translate-x-10"
            size={80}
            color="#376FEF"
          />
        </div>
      )}
      {children}
    </>
  );
};

export default Loader;
