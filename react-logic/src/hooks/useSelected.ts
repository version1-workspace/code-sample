import { useState } from "react";

export const useSelected = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const isSelected = (item: string) => {
    return selected.some((t) => t === item);
  };

  const toggle = (item: string) => {
    if (isSelected(item)) {
      setSelected(selected.filter((t) => t !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const clear = () => {
    setSelected([]);
  };

  return { selected, isSelected, toggle, clear };
};
