import { Door } from "../../../../shared/types";

const DoorComponent = ({ door, cellId }: { door: Door; cellId: string }) => {
  if (door.cellIds[0] !== cellId) return null;

  return <div className="door" style={{ transform: door.transform }}></div>;
};

export default DoorComponent;
