import { useState, useEffect } from 'react';

const MakeError = () => {
  const [number, setNumber] = useState<number | null>(null);
  const handleClick = () => {
    const number = Math.random();
    setNumber(number);
  };

  useEffect(() => {
    // click 事件中的error getDerivedStateFromError 无法捕获
    if (number && number > 0.5) {
      throw new Error('大于0.5');
    }
  }, [number]);

  return (
    <div>
      <h3>MakeError  {number}</h3>
      <button onClick={handleClick}>随机触发Error</button>
      <hr />
    </div>
  );
};

export default MakeError;
