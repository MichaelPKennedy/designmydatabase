import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const HeaderContainer = styled.header`
  background-color: #1a1a1a;
  padding: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;

const Logo = styled.h1`
  color: #fff;
  margin: 0;
  font-size: 1.3rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <LogoLink to="/">
        <Logo>DesignMyDatabase</Logo>
      </LogoLink>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
