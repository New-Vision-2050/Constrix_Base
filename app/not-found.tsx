"use client";
import Link from "next/link";

const NotFound = () => {
  return (
    <section className="px-4 py-8 text-center">
      <div className="max-w-auto mx-auto">
        <div className="mx-auto md:max-w-lg">
          <p className="text-[150px] font-semibold text-gray-300 md:text-[200px]">
            404
          </p>
        </div>
        <h2 className="mt-8 text-xl font-black lg:text-5xl">
          Oops! Something went wrong
        </h2>
        <p className="my-2 text-sm text-primary lg:text-base">
          Page dosen&apos;t exist
        </p>
        <Link href={"/"} className="mainLink mx-auto mt-4">
          Go to home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
