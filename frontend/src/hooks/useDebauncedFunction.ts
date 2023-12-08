import { useCallback, useEffect, useRef } from "react";

type DebouncedFunction = <T extends unknown[]>(
  func: (...args: T) => void,
  customTimeout?: number
) => (...args: T) => void;

//  https://gist.github.com/josippapez/db54fb0ea254153d4fb808e401f82cb2
export const useDebouncedFunction: DebouncedFunction = <T extends unknown[]>(
  func: (...args: T) => void,
  timeout = 600
) => {
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  const debouncedFunction = useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, timeout);
    },
    [func, timeout]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
};
