import "./UI.css";

const Switch = ({ onChange }: { onChange: () => void }) => {
  return (
    <label className="switch">
      <input type="checkbox" onChange={onChange} />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;
