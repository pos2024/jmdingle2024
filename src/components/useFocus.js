import { useEffect } from 'react';

const useFocus = (ref, dependencies) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, dependencies);
};

export default useFocus;
