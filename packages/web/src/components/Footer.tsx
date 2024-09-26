import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  color: #fff;
  padding: 1rem;
  text-align: center;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>&copy; 2023 Database Designer. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
