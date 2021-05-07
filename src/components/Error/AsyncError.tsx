import { useEffect, useState } from 'react';
import { useErrorHandler } from '../../lib/ErrorBoundary';

const AsyncError = () => {
  const handleError = useErrorHandler();

  const [number, setNumber] = useState<number>(0);

  const randomlyFetchData = async () => {
    return Math.random();
  }

  useEffect(() => {
    try {
      if (number > 0.5) {
        throw new Error('async 大于 0.5');
      } else {
        setNumber(number);
      }
    } catch (error) {
      handleError(error)
    }
  }, [number, handleError]);

  const handleClick = () => {
    const number = Math.random();
    setNumber(number);
    randomlyFetchData().then(number => {
      setNumber(number);
    });
  };

  return (<div>
    <h3>MakeError  {number}</h3>
    <button onClick={handleClick}>随机触发Error</button>
  </div>)
}

export default AsyncError;
