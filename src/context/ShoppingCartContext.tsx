import { createContext, useContext, ReactNode, useState } from 'react';
import ShoppingCart from '../components/ShoppingCart';
import useLocalStorage from '../hooks/useLocalStorage';

//(ZONE: 타입지정영역)
type ShoppingCartProviderProps = {
  children: ReactNode;
};
type CartItem = {
  id: number;
  quantity: number;
};
type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

//(ZONE: createContext해서 나만의 context만들기)
//타입을 ShoppingCartContext라는 타입으로 assert해주기
const ShoppingCartContext = createContext({} as ShoppingCartContext);
//커스텀후크化해서 안전하게 빼주기
export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

//(ZONE: provider로 컴포넌트에 제공해줄 함수들이나 상수들)
function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  //장바구니창 열고닫기 state
  const [isOpen, setIsOpen] = useState(false);
  //새로고침해도 state초기화 않고, 장바구니에 담은 거 로컬스토리지 저장state
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart', []);
  //장바구니에 담긴 수량 누적표기.
  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);

  //장바구니창 열고닫기 함수
  const openCart = () => {
    setIsOpen(true);
  };
  const closeCart = () => {
    setIsOpen(false);
  };

  //해당 컴포넌트의 수량누적을 반영하기 위한 함수
  function getItemQuantity(id: number) {
    //로컬스토리지에 있는 item의 id와 인자값으로 들어온 id가 일치하는지 비교하고 맞으면 해당id의 quantity 반환 . (그게 아니라면 디폴트로 있어주어야 할 0 반환)
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }
  //장바구니 신추가 & 장바구니에 이미 해당상품이 들어있다면 수량만추가
  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      //prev state에서 increaseCartQuantity 인자로 받은 id와 prev state의 id가 일치하는 거 있는지 비교해보고 없으면 state에 id는 id, quantity는 1로 만들어준 뒤 반환
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        //근데 이미 prev state에 id가 있네? 그럼 아래 실행
        return currItems.map((item) => {
          //만약 인자로 들어온 id가 prev state안에 있는 id와 일치하면 거기에 수량만+1해주기
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  //수량빼기
  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      //만약 prev state와 비교해서 인자로 들어온 id가 일치하는 게 있는지? 그리고 그게 지금 quantity가 1과 같다면 id를 없애버려라 = 즉 장바구니에서 삭제해라
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        //그렇지 않다면 id가 일치하는지 비교해보고 같은 id에 대해 수량만 -1해라
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  //장바구니에서 삭제하기
  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  return (
    //이제 ShoppingCartContext에는 위에 적은 모든 함수나 상수 등이 담겨져서 Provider를 통해 children에 침략할 운명.
    <ShoppingCartContext.Provider
      value={{
        openCart,
        closeCart,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartQuantity,
        cartItems,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
export default ShoppingCartProvider;
