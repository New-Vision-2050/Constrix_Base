import { redirect } from "next/navigation";

export default async function Home() {
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start p-10">
      test
    </main>
  );
}

export async function getStaticProps() {
  redirect(`/ar/login`);
}
