import React from 'react';
import { Button } from 'react-bootstrap';
import Stack from 'react-bootstrap/esm/Stack';
import { useShoppingCart } from '../context/ShoppingCartContext';
import storeItems from '../data/items.json';
import formatCurrency from '../utilities/formatCurrency';

type CartItemProps = {
  id: number;
  quantity: number;
};

//props로 전개구문처리한 {...item}를 받았는데, 그 중 id랑 quantity만 갖다 쓰자.
function CartItem({ id, quantity }: CartItemProps) {
  const { removeFromCart } = useShoppingCart();
  //data.json안에 있는 id와 인자로 받은 id를 일치시켜서 반환
  const item = storeItems.find((i) => i.id === id);

  //아이템이 없으면 null, 있으면 div안 보여주기
  if (item == null) return null;
  return (
    <Stack direction='horizontal' gap={2} className='d-flex align-items-center'>
      <img src={item.imgUrl} style={{ width: '125px', height: '75px', objectFit: 'cover' }} />
      <div className='me-auto'>
        {item.name}
        {/* 수량이 1초과할 경우 곱하기표기로 몇 개 담은 상태인지 보여주기 */}
        {quantity > 1 && (
          <span className='text-muted' style={{ fontSize: '.65rem' }}>
            X {quantity}
          </span>
        )}
        {/* 담은 물건의 1개 금액 */}
        <div className='text-muted' style={{ fontSize: '.75rem' }}>
          {formatCurrency(item.price)}
        </div>
      </div>
      {/* 현재 담은 물건의 수량에 비례한 금액 */}
      <div>{formatCurrency(item.price * quantity)}</div>
      {/* 장바구니에서 삭제하기 */}
      <Button variant='outline-danger' size='sm' onClick={() => removeFromCart(item.id)}>
        &times;
      </Button>
    </Stack>
  );
}

export default CartItem;
