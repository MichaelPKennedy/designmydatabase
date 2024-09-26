import React, { useState } from "react";
import ERDiagram from "./ERDiagram";
import LoadingSpinner from "./LoadingSpinner";
import feathersClient from "../../../feathersClient";
import styled from "styled-components";

interface Suggestion {
  people: string[];
  resources: string[];
  activities: string[];
}

const CenteredButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  width: 100%;
  text-align: center;
`;

const DatabaseForm: React.FC = () => {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null);
  const [selectedItems, setSelectedItems] = useState<Suggestion>({
    people: [],
    resources: [],
    activities: [],
  });
  const [customItem, setCustomItem] = useState("");
  const [result, setResult] = useState<{
    sqlCode: string;
    mermaidCode: string;
  } | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [businessDetails, setBusinessDetails] = useState("");

  const handleBusinessNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBusinessTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await feathersClient
        .service("openai")
        .find({ query: { businessType } });
      setSuggestions(response);
      setStep(3);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (category: keyof Suggestion, item: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter((i) => i !== item)
        : [...prev[category], item],
    }));
  };

  const handleCustomItemSubmit = (
    e: React.FormEvent,
    category: keyof Suggestion
  ) => {
    e.preventDefault();
    if (customItem.trim()) {
      setSelectedItems((prev) => ({
        ...prev,
        [category]: [...prev[category], customItem.trim()],
      }));
      setCustomItem("");
    }
  };

  const handleNextSection = () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const response = await feathersClient.service("openai").create({
        name: businessName,
        type: businessType,
        details: businessDetails,
        ...selectedItems,
      });
      setResult(response);
      setStep(7);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuggestions = (category: keyof Suggestion) => {
    if (!suggestions) return null;

    const uniqueItems = new Set([
      ...suggestions[category],
      ...selectedItems[category],
    ]);

    return (
      <div style={{ width: "100%" }}>
        <ul style={styles.suggestionList}>
          {Array.from(uniqueItems).map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(category, item)}
              style={{
                ...styles.suggestionItem,
                ...(selectedItems[category].includes(item)
                  ? styles.selected
                  : {}),
              }}
            >
              {item}
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e) => handleCustomItemSubmit(e, category)}
          style={{ width: "100%" }}
        >
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <div
              style={{ ...styles.inputContainer, flex: 1, marginRight: "10px" }}
            >
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder={`Add custom ${category}`}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.button}>
              Add Custom
            </button>
          </div>
        </form>
      </div>
    );
  };

  const StepInstructions: React.FC<{
    question: string;
    instructions: string;
  }> = ({ question, instructions }) => (
    <div style={styles.instructionsContainer}>
      <h3 style={styles.question}>{question}</h3>
      <p style={styles.instructions}>{instructions}</p>
    </div>
  );

  const renderStep = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    switch (step) {
      case 1:
        return (
          <div style={styles.formContainer}>
            <div style={styles.form}>
              <StepInstructions
                question="What's the name of your business?"
                instructions="Enter the name of your business or project. This will help us personalize the database schema for you."
              />
              <form
                onSubmit={handleBusinessNameSubmit}
                style={{ width: "100%" }}
              >
                <div style={styles.inputContainer}>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter your business name"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.buttonContainer}>
                  <button type="submit" style={styles.button}>
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={styles.formContainer}>
            <div style={styles.form}>
              <StepInstructions
                question="What type of business are you running?"
                instructions="Describe your business type or industry. This helps us suggest relevant database entities and relationships."
              />
              <form
                onSubmit={handleBusinessTypeSubmit}
                style={{ width: "100%" }}
              >
                <div style={styles.inputContainer}>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="Enter your business type"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.buttonContainer}>
                  <button type="submit" style={styles.button}>
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={styles.formContainer}>
            <div style={styles.form}>
              <StepInstructions
                question="Who are the key people or roles in your business?"
                instructions="Select from the suggested roles or add custom ones. These will become entities or attributes in your database schema."
              />
              {renderSuggestions("people")}
            </div>
          </div>
        );
      case 4:
        return (
          <div style={styles.formContainer}>
            <div style={styles.form}>
              <StepInstructions
                question="What are the main resources or assets in your business?"
                instructions="Choose from the suggested resources or add your own. These will be translated into database tables or attributes."
              />
              {renderSuggestions("resources")}
            </div>
          </div>
        );
      case 5:
        return (
          <div style={styles.formContainer}>
            <div style={styles.form}>
              <StepInstructions
                question="What are the key activities or processes in your business?"
                instructions="Select or add activities that are central to your business. These will help define relationships and tables in your database."
              />
              {renderSuggestions("activities")}
            </div>
          </div>
        );
      case 6:
        return (
          <div style={styles.formContainer}>
            <div style={styles.form}>
              <StepInstructions
                question="Any additional details about your business needs? (Optional)"
                instructions="Provide up to 100 words describing specific requirements or unique aspects of your business. This will help us fine-tune your database schema."
              />
              <div style={styles.inputContainer}>
                <textarea
                  value={businessDetails}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/);
                    if (words.length <= 100) {
                      setBusinessDetails(e.target.value);
                    }
                  }}
                  style={{
                    ...styles.input,
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                />
                <p style={styles.wordCount}>
                  {businessDetails.trim().split(/\s+/).length}/100 words
                </p>
              </div>
            </div>
          </div>
        );
      case 7:
        return result ? (
          <div>
            <ERDiagram result={result} />
          </div>
        ) : (
          <p>Generating ERD...</p>
        );
      default:
        return null;
    }
  };

  const styles = {
    formContainer: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
    },
    form: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "10px",
      maxWidth: "400px",
      width: "100%",
      margin: "0 auto",
      alignItems: "flex-start",
      boxSizing: "border-box" as "border-box",
    },
    inputContainer: {
      display: "flex",
      flexDirection: "column" as const,
      width: "100%",
      marginBottom: "10px",
    },
    input: {
      padding: "10px",
      fontSize: "16px",
      width: "100%",
      boxSizing: "border-box" as "border-box",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      padding: "10px",
      fontSize: "16px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      alignSelf: "flex-start",
    },
    suggestionItem: {
      cursor: "pointer",
      padding: "5px 10px",
      margin: "5px 0",
      borderRadius: "3px",
      transition: "background-color 0.3s",
      width: "100%",
      textAlign: "left" as const,
    },
    selected: {
      backgroundColor: "#e0e0ff",
      fontWeight: "bold",
    },
    instructionsContainer: {
      textAlign: "left" as const,
      width: "100%",
    },
    question: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    instructions: {
      fontSize: "14px",
      color: "#666",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-start",
      width: "100%",
      maxWidth: "400px",
      margin: "20px auto 0",
    },
    suggestionList: {
      listStyle: "none",
      padding: 0,
      width: "100%",
      margin: 0,
      marginBottom: "20px",
    },
    wordCount: {
      fontSize: "12px",
      color: "#666",
      marginTop: "5px",
      alignSelf: "flex-start",
    },
  };

  return (
    <div>
      {renderStep()}
      {step >= 3 && step <= 6 && (
        <div style={styles.buttonContainer}>
          {isLoading ? (
            <CenteredButton disabled>Generating...</CenteredButton>
          ) : (
            <button
              onClick={handleNextSection}
              style={styles.button}
              disabled={isLoading}
            >
              {step === 6 ? "Generate ERD" : "Next Section"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseForm;
