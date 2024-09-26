import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  background-color: #1a1a1a;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: #fff;
  margin: 0;
  font-size: 1.5rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled.a`
  color: #fff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo>DesignMyDatabase</Logo>
      <Nav>
        <NavLink href="#">Home</NavLink>
        <NavLink href="#">Contact</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
