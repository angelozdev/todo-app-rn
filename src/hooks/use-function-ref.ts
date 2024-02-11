import { useCallback, useEffect, useRef } from "react";

function useFunctionRef<T extends (...args: Parameters<T>) => void>(fn?: T) {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  });

  return useCallback((...args: Parameters<T>) => fnRef.current?.(...args), []);
}

export default useFunctionRef;
