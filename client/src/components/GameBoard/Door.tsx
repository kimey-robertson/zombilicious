import { Door } from "../../../../shared/types";

const DoorComponent = ({ door, cellId }: { door: Door; cellId: string }) => {
  if (door.cellIds[1] !== cellId) return null;

  return (
    <div
      className="door"
      onClick={() => {
        console.log("door clicked");
      }}
      style={{
        transform: door.transform,
        backgroundColor: door.state === "open" ? "green" : "red",

      }}
    ></div>
  );
};

export default DoorComponent;
