'use client';
const GlobalError = () => {
  return (
    <section className="container px-4 py-8 text-center">
      <div className="max-w-auto mx-auto">
        <div className="mx-auto md:max-w-lg">
          <p className="text-[150px] font-semibold text-gray-300 md:text-[200px]">
            500
          </p>
        </div>
        <h2 className="mt-8 text-xl font-black lg:text-5xl">
          Oops! Something went wrong
        </h2>
        <p className="my-2 text-sm text-primary lg:text-base">
          We&apos;re having trouble processing your request right now. Please
          try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mainLink mx-auto mt-4"
        >
          Try Again
        </button>
      </div>
    </section>
  );
};

export default GlobalError;
