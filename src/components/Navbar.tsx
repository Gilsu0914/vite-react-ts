import React from 'react';
import { Button, Nav, Container, Navbar as NavbarBs } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext';

function Navbar() {
  const { openCart, cartQuantity } = useShoppingCart();

  return (
    <NavbarBs sticky='top' className='bg-white shadow-sm mb-3'>
      <Container>
        <Nav className='me-auto'>
          <Nav.Link to='/' as={NavLink}>
            홈
          </Nav.Link>
          <Nav.Link to='/store' as={NavLink}>
            스토어
          </Nav.Link>
          <Nav.Link to='/about' as={NavLink}>
            어바웃
          </Nav.Link>
        </Nav>

        {/* 장바구니에 담긴 수량이 0초과인순간부터 이 화면 보여주기 */}
        {cartQuantity > 0 && (
          <Button style={{ position: 'relative' }} onClick={openCart}>
            장바구니
            <div
              className='rounded-circle bg-danger d-flex justify-content-center align-itmes-center'
              style={{ color: 'white', width: '1.5rem', height: '1.5rem', position: 'absolute', bottom: 0, right: 0, transform: 'translate(25%, 25%)' }}
            >
              {cartQuantity}
            </div>
          </Button>
        )}
      </Container>
    </NavbarBs>
  );
}

export default Navbar;
