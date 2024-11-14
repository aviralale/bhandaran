import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <div className="text-white flex items-end">
            <Image
              src="/vercel.svg"
              alt="logo"
              width={82}
              height={82}
              className="h-auto"
            />
            <h1 className="text-7xl font-bold">भण्डारण</h1>
          </div>
          <div className="space-y5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              This is the place where you can store all your files
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="Files"
            width={342}
            height={342}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>
      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/vercel.svg"
            alt="logo"
            width={82}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>
        {children}
      </section>
    </div>
  );
};

export default Layout;
