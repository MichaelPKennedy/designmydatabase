import React, { useState } from "react";
import ERDiagram from "./ERDiagram";
import LoadingSpinner from "./LoadingSpinner";
import feathersClient from "../../../feathersClient";

interface Suggestion {
  people: string[];
  resources: string[];
  activities: string[];
}

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
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setFeedback(`Added "${customItem.trim()}" to ${category}`);
      setTimeout(() => setFeedback(""), 3000); // Clear feedback after 3 seconds
    }
  };

  const handleNextSection = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await feathersClient.service("openai").create({
        name: businessName,
        type: businessType,
        ...selectedItems,
      });
      setResult(response);
      setStep(6);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuggestions = (category: keyof Suggestion) => {
    if (!suggestions) return null;

    // Create a Set of unique items
    const uniqueItems = new Set([
      ...suggestions[category],
      ...selectedItems[category],
    ]);

    return (
      <div style={{ width: "100%" }}>
        <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
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
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div style={{ display: "flex", width: "100%" }}>
            <input
              type="text"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              placeholder={`Add custom ${category.slice(0, -1)}`}
              style={{ ...styles.input, flexGrow: 1, marginRight: "10px" }}
            />
            <button type="submit" style={styles.button}>
              Add Custom
            </button>
          </div>
          {feedback && <p style={styles.feedback}>{feedback}</p>}
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
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  required
                  style={styles.input}
                />
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
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="Enter your business type"
                  required
                  style={styles.input}
                />
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
    },
    input: {
      padding: "5px",
      fontSize: "16px",
      width: "100%",
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
    feedback: {
      color: "green",
      marginTop: "5px",
      fontSize: "14px",
      alignSelf: "flex-start",
    },
    instructionsContainer: {
      marginBottom: "20px",
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
    bottomButtonContainer: {
      display: "flex",
      justifyContent: "flex-start",
      width: "100%",
      maxWidth: "400px",
      margin: "20px auto 0",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "10px",
      width: "100%",
    },
  };

  return (
    <div>
      {renderStep()}
      {step >= 3 && step <= 5 && (
        <div style={styles.bottomButtonContainer}>
          <button
            onClick={handleNextSection}
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading
              ? "Generating..."
              : step === 5
              ? "Generate ERD"
              : "Next Section"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DatabaseForm;
