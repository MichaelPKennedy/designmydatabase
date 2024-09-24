import React, { useState } from "react";
import ERDiagram from "./ERDiagram";
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

  const handleBusinessNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBusinessTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await feathersClient
        .service("openai")
        .find({ query: { businessType } });
      setSuggestions(response);
      setStep(3);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
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
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
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
    }
  };

  const renderSuggestions = (category: keyof Suggestion) => {
    if (!suggestions) return null;
    return (
      <div style={styles.form}>
        <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {suggestions[category].map((item, index) => (
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
          style={{ display: "flex" }}
        >
          <input
            type="text"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            placeholder={`Add custom ${category.slice(0, -1)}`}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Add Custom
          </button>
        </form>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleBusinessNameSubmit} style={styles.form}>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Next
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleBusinessTypeSubmit} style={styles.form}>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="Enter your business type"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Get Suggestions
            </button>
          </form>
        );
      case 3:
        return renderSuggestions("people");
      case 4:
        return renderSuggestions("resources");
      case 5:
        return renderSuggestions("activities");
      case 6:
        return result ? (
          <ERDiagram result={result} />
        ) : (
          <p>Generating ERD...</p>
        );
      default:
        return null;
    }
  };

  const styles = {
    suggestionItem: {
      cursor: "pointer",
      padding: "5px 10px",
      margin: "5px 0",
      borderRadius: "3px",
      transition: "background-color 0.3s",
    },
    selected: {
      backgroundColor: "#e0e0ff",
      fontWeight: "bold",
    },
    form: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "10px",
      maxWidth: "400px",
      margin: "0 auto",
    },
    input: {
      padding: "5px",
      fontSize: "16px",
    },
    button: {
      padding: "10px",
      fontSize: "16px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
    },
  };

  return (
    <div>
      {renderStep()}
      {step >= 3 && step <= 5 && (
        <button
          onClick={handleNextSection}
          style={{ ...styles.button, marginTop: "20px" }}
        >
          {step === 5 ? "Generate ERD" : "Next Section"}
        </button>
      )}
    </div>
  );
};

export default DatabaseForm;
