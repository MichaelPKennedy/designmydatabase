import React, { useState } from "react";
import styled from "styled-components";
import feathersClient from "../../../feathersClient";

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
`;

const StyledTextarea = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  height: 150px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await feathersClient.service("email").create({ name, email, message });
      setSubmitMessage("Your message has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setSubmitMessage("An error occurred. Please try again later.");
    }
    setIsSubmitting(false);
  };

  return (
    <FormContainer>
      <h2>Contact Us</h2>
      <StyledForm onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <StyledInput
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <StyledTextarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </SubmitButton>
      </StyledForm>
      {submitMessage && <p>{submitMessage}</p>}
    </FormContainer>
  );
};

export default ContactForm;
