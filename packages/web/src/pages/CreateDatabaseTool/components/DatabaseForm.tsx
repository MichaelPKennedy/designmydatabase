import React, { useState } from "react";
import ERDiagram from "./ERDiagram";
import feathersClient from "../../../feathersClient";

interface Suggestion {
  people: string[];
  resources: string[];
  activities: string[];
}

interface Suggestions {
  people: string[];
  resources: string[];
  activities: string[];
}

const DatabaseForm: React.FC = () => {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customPeople, setCustomPeople] = useState<string[]>([]);
  const [customResources, setCustomResources] = useState<string[]>([]);
  const [customActivities, setCustomActivities] = useState<string[]>([]);
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
      setSuggestions(response); // Assuming the response is already in the correct format
      setStep(3);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionSelect = (category: keyof Suggestion, item: string) => {
    switch (category) {
      case "people":
        setSelectedPeople((prev) => [...prev, item]);
        break;
      case "resources":
        setSelectedResources((prev) => [...prev, item]);
        break;
      case "activities":
        setSelectedActivities((prev) => [...prev, item]);
        break;
    }
  };

  const handleCustomAdd = (category: keyof Suggestion, item: string) => {
    switch (category) {
      case "people":
        setCustomPeople((prev) => [...prev, item]);
        break;
      case "resources":
        setCustomResources((prev) => [...prev, item]);
        break;
      case "activities":
        setCustomActivities((prev) => [...prev, item]);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await feathersClient.service("openai").create({
        name: businessName,
        type: businessType,
        people: [...selectedPeople, ...customPeople],
        resources: [...selectedResources, ...customResources],
        activities: [...selectedActivities, ...customActivities],
      });
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleBusinessNameSubmit}>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
              required
            />
            <button type="submit">Next</button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleBusinessTypeSubmit}>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="Enter your business type"
              required
            />
            <button type="submit">Get Suggestions</button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleSubmit}>
            {suggestions && (
              <>
                <div>
                  <h3>People</h3>
                  {suggestions.people.map((person) => (
                    <button
                      key={person}
                      type="button"
                      onClick={() => handleSuggestionSelect("people", person)}
                    >
                      {person}
                    </button>
                  ))}
                  <input
                    type="text"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCustomAdd("people", e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    placeholder="Add custom person"
                  />
                </div>
                <div>
                  <h3>Resources</h3>
                  {suggestions.resources.map((resource) => (
                    <button
                      key={resource}
                      type="button"
                      onClick={() =>
                        handleSuggestionSelect("resources", resource)
                      }
                    >
                      {resource}
                    </button>
                  ))}
                  <input
                    type="text"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCustomAdd("resources", e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    placeholder="Add custom resource"
                  />
                </div>
                <div>
                  <h3>Activities</h3>
                  {suggestions.activities.map((activity) => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() =>
                        handleSuggestionSelect("activities", activity)
                      }
                    >
                      {activity}
                    </button>
                  ))}
                  <input
                    type="text"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCustomAdd("activities", e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    placeholder="Add custom activity"
                  />
                </div>
              </>
            )}
            <button type="submit">Generate ERD</button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderStep()}
      {step === 3 && suggestions && (
        <div>
          <h3>Suggested People:</h3>
          <ul>
            {suggestions.people.map((person, index) => (
              <li key={index}>{person}</li>
            ))}
          </ul>

          <h3>Suggested Resources:</h3>
          <ul>
            {suggestions.resources.map((resource, index) => (
              <li key={index}>{resource}</li>
            ))}
          </ul>

          <h3>Suggested Activities:</h3>
          <ul>
            {suggestions.activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      )}
      {result && <ERDiagram result={result} />}
    </div>
  );
};

export default DatabaseForm;
