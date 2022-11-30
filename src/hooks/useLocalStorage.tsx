import React, { useEffect, useState } from 'react';

//key는 'shopping-cart'

function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    //일단 'shopping-cart' 로컬저장소 가져오기
    const jsonValue = localStorage.getItem(key);
    //근데 가져온 로컬저장소가 null이 아니면 json.parse해주자.
    if (jsonValue != null) return JSON.parse(jsonValue);

    //아래는 TS때문에 narrowing을 위한 작업인 거 같음. 타입에 따라 initialValue의 포지션을 지정하라는 거 같음.
    if (typeof initialValue === 'function') {
      return (initialValue as () => T)();
    } else {
      return initialValue;
    }
  });

  //컴포넌트가 처음 마운트 될 때 1번, value가 달라질때마다 업데이트되어 로컬저장소에 해당 key에다 setItem해주기
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
}

export default useLocalStorage;
