import { useState } from 'react';

interface SwitchProps {
  label?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ label, defaultChecked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked);

  const handleChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
    if (onChange) onChange(!isChecked);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {label && <label style={{ marginRight: 8 }}>{label}</label>}
      <div
        onClick={handleChange}
        style={{
          cursor: 'pointer',
          width: '50px',
          height: '24px',
          borderRadius: '50px',
          backgroundColor: isChecked ? '#4CAF50' : '#ccc',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: isChecked ? '26px' : '2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'white',
            transition: 'left 0.2s',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Switch;
