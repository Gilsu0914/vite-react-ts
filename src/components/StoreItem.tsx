import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useShoppingCart } from '../context/ShoppingCartContext';
import formatCurrency from '../utilities/formatCurrency';

type StoreItemProps = {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
};

function StoreItem({ id, name, price, imgUrl }: StoreItemProps) {
  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } = useShoppingCart();

  //수량누적에 따라 반영하기 위한 함수
  //로컬스토리지에 있는 item의 id와 인자값으로 넣어준 이 컴포넌트(상품)id가 일치하는지 비교하고 맞으면 해당id의 quantity 반환 . (그게 아니라면 디폴트로 있어주어야 할 0 반환)
  const quantity = getItemQuantity(id);

  return (
    <Card className='h-100'>
      {/* 상품이미지 */}
      <Card.Img variant='top' src={imgUrl} height='200px' style={{ objectFit: 'cover' }} />
      <Card.Body className='d-flex flex-column'>
        {/* 상품명, 가격 */}
        <Card.Title className='d-flex justify-content-between align-items-baseline mb-4'>
          <span className='fs-2'>{name}</span>
          <span className='ms-2 text-muted'>{formatCurrency(price)}</span>
        </Card.Title>

        {/* 수량추가, 수량감소, 장바구니삭제 */}
        <div className='mt-auto'>
          {/* 수량 0이면 '장바구니추가' 보여주고, 수량 1이상이면 '추가감량삭제' 보여주기 */}
          {quantity === 0 ? (
            //장바구니에 신추가. 해당 item의 id를 인자로 넣어줘야 매직박스 잘 돌아감.
            <Button className='w-100' onClick={() => increaseCartQuantity(id)}>
              장바구니에 추가
            </Button>
          ) : (
            // 장바구니에 해당상품 1개라도 담았다면 보여줄 화면: 수량추가,수량빼기, 장바구니 삭제
            <div className='d-flex justify-content-center align-items-center' style={{ gap: '.5rem' }}>
              <Button onClick={() => decreaseCartQuantity(id)}>-</Button>
              <div className='fs-3'>{quantity}</div>
              <Button onClick={() => increaseCartQuantity(id)}>+</Button>
              <div className='d-flex align-items-center justify-content-center'>
                <Button variant='danger' onClick={() => removeFromCart(id)}>
                  장바구니삭제
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default StoreItem;
