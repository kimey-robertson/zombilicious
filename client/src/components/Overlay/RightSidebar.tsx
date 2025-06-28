import ZoneInfoPanel from "./ZoneInfoPanel";

const RightSidebar = () => {
  return (
    <div className="right-side-bar">
      <ZoneInfoPanel
        zoneInfo={{
          id: "Zone 1",
          zombies: 10,
          survivors: 5,
          noise: 80,
        }}
      />
    </div>
  );
};

export default RightSidebar;
