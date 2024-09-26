import React from "react";
import ContactForm from "../components/ContactForm";
import styled from "styled-components";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ContactPage: React.FC = () => {
  return (
    <PageContainer>
      <h1>Contact Us</h1>
      <ContactForm />
    </PageContainer>
  );
};

export default ContactPage;
