import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DatabaseForm from "./pages/CreateDatabaseTool/components/DatabaseForm";
import ContactForm from "./pages/CreateDatabaseTool/components/ContactForm";
import "./App.css";

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1>Create Your Database Schema</h1>
                  <p>
                    Use our AI-powered tool to design your database schema
                    quickly and easily.
                  </p>
                  <DatabaseForm />
                </>
              }
            />
            <Route path="/contact" element={<ContactForm />} />
          </Routes>
        </MainContent>
        <Footer />
      </AppContainer>
    </Router>
  );
}

export default App;
