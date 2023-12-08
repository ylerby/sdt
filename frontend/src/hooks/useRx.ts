import { useState, useEffect, useCallback } from "react";
import { BehaviorSubject } from "rxjs";

export function useRx<Value>(
  $subject: BehaviorSubject<Value>
): [Value, (value: Value) => void] {
  const [value, setValue] = useState<Value>($subject.value);

  const setValueAction = useCallback(
    (value: Value) => $subject.next(value),
    [$subject]
  );

  useEffect(() => {
    const subscription = $subject.subscribe((newValue) => setValue(newValue));

    return () => {
      subscription.unsubscribe();
    };
  }, [$subject]);

  return [value, setValueAction];
}
