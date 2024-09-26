import styled from "styled-components";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DatabaseForm from "./pages/CreateDatabaseTool/components/DatabaseForm";
import "./App.css";

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <h1>Create Your Database Schema</h1>
        <p>
          Use our AI-powered tool to design your database schema quickly and
          easily.
        </p>
        <DatabaseForm />
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App;
