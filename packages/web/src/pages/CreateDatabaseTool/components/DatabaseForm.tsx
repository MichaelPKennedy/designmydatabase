import React, { useState, ChangeEvent, FormEvent } from "react";
import feathersClient from "../../../feathersClient";

import ERDiagram from "./ERDiagram";

interface BusinessDetails {
  name: string;
  people: string[];
  resources: string[];
  activities: string[];
  summary: string;
}

const DatabaseForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    name: "",
    people: [""],
    resources: [""],
    activities: [""],
    summary: "",
  });
  const [result, setResult] = useState<{
    sqlCode: string;
    mermaidCode: string;
  } | null>(null);

  const handleChange = (
    field: keyof BusinessDetails,
    index: number | null,
    value: string
  ) => {
    if (index === null) {
      setBusinessDetails({ ...businessDetails, [field]: value });
    } else {
      const updatedField = [...(businessDetails[field] as string[])];
      updatedField[index] = value;
      setBusinessDetails({ ...businessDetails, [field]: updatedField });
    }
  };

  const addField = (field: keyof BusinessDetails) => {
    setBusinessDetails({
      ...businessDetails,
      [field]: [...(businessDetails[field] as string[]), ""],
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await feathersClient
      .service("openai")
      .create(businessDetails);
    console.log("response", response);
    setResult(response);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2>Step 1: Business Information</h2>
            <input
              type="text"
              value={businessDetails.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setBusinessDetails({ ...businessDetails, name: e.target.value })
              }
              placeholder="What is the name of your business?"
            />
            <button type="button" onClick={() => setStep(1)}>
              Next
            </button>
          </div>
        );
      case 1:
        return (
          <div>
            <h2>Step 2: People</h2>
            {businessDetails.people.map((person, index) => (
              <input
                key={index}
                type="text"
                value={person}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("people", index, e.target.value)
                }
                placeholder="Who are the main types of people involved in your business? (e.g., Customers, Employees)"
              />
            ))}
            <button type="button" onClick={() => addField("people")}>
              Add Another Person
            </button>
            <button type="button" onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 3: Resources, Products, or Services</h2>
            {businessDetails.resources.map((resource, index) => (
              <input
                key={index}
                type="text"
                value={resource}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("resources", index, e.target.value)
                }
                placeholder="What are the resources, products, or services you provide?"
              />
            ))}
            <button type="button" onClick={() => addField("resources")}>
              Add Another Resource
            </button>
            <button type="button" onClick={() => setStep(3)}>
              Next
            </button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 5: Business Activities</h2>
            {businessDetails.activities.map((activity, index) => (
              <input
                key={index}
                type="text"
                value={activity}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("activities", index, e.target.value)
                }
                placeholder="What are the main activities in your business? (e.g., Selling Products, Providing Services)"
              />
            ))}
            <button type="button" onClick={() => addField("activities")}>
              Add Another Activity
            </button>
            <button type="button" onClick={() => setStep(5)}>
              Next
            </button>
          </div>
        );
      case 4:
        return (
          <div>
            <h2>Step 7: Business Summary</h2>
            <textarea
              value={businessDetails.summary}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("summary", null, e.target.value)
              }
              placeholder="Summarize your business as best as possible. Include any additional details that might help in designing the database."
            />
            <button type="button" onClick={() => setStep(7)}>
              Next
            </button>
          </div>
        );
      case 5:
        return (
          <div>
            <h2>Review and Submit</h2>
            <button type="submit">Generate ERD</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>{renderStep()}</form>
      {result && <ERDiagram result={result} />}
    </div>
  );
};

export default DatabaseForm;
