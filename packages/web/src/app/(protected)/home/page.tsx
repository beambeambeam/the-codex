import HomeCanvas from "@/app/(protected)/home/_components/canvas";

function HomePage() {
  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-4">
      <div className="flex flex-col text-2xl font-semibold">
        <h1>What are you</h1>
        <h1>interest in today?</h1>
      </div>
      <HomeCanvas />
    </div>
  );
}
export default HomePage;
