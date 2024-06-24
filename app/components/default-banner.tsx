import { Banner } from 'flowbite-react';

const DefaultBanner = () => {
  return (
    <Banner className="">
      <div className="w-[80%] mx-auto border rounded-md border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
        <h3 className="text-center">Upload a file to get started</h3>

        <p className="font-bold text-center my-2">OR</p>
        <p className="text-center">Choose one of your recent files</p>
      </div>
    </Banner>
  );
};

export default DefaultBanner;
