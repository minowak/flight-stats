import dynamic from "next/dynamic";

export const FlightMapWrapper: React.FC = () => {
  const DynamicMap = dynamic(() => import("@/components/stats/flight-map"),
    { ssr: false });

  return (
    <div className="h-[500px] md:h-[700px]">
      <DynamicMap posix={[50.086485, 19.791569]} zoom={2.5} />
    </div>
  );
}
