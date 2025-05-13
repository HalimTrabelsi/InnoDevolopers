// client/src/hooks/useCountdown.js
import { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countdown, setCountdown] = useState(() =>
    getReturnValues(countDownDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getReturnValues(countDownDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return countdown;
};

const getReturnValues = (countDownDate) => {
  const now = new Date().getTime();
  const distance = countDownDate - now;

  if (distance <= 0) return [0, 0, 0, 0];

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

export default useCountdown;
