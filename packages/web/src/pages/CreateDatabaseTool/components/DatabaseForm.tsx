import React, { useState, ChangeEvent, FormEvent } from "react";

interface Entity {
  name: string;
  attributes: string[];
}

const DatabaseForm: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>([
    { name: "", attributes: [""] },
  ]);
  const [result, setResult] = useState<{
    sqlCode: string;
    mermaidCode: string;
  } | null>(null);

  const handleEntityChange = (index: number, value: string) => {
    const newEntities = [...entities];
    newEntities[index].name = value;
    setEntities(newEntities);
  };

  const handleAttributeChange = (
    entityIndex: number,
    attributeIndex: number,
    value: string
  ) => {
    const newEntities = [...entities];
    newEntities[entityIndex].attributes[attributeIndex] = value;
    setEntities(newEntities);
  };

  const addEntity = () => {
    setEntities([...entities, { name: "", attributes: [""] }]);
  };

  const addAttribute = (index: number) => {
    const newEntities = [...entities];
    newEntities[index].attributes.push("");
    setEntities(newEntities);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/openai", {
      // Adjust the endpoint if needed
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entities }),
    });
    const result = await response.json();
    setResult(result);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {entities.map((entity, entityIndex) => (
          <div key={entityIndex}>
            <input
              type="text"
              value={entity.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleEntityChange(entityIndex, e.target.value)
              }
              placeholder="Entity Name"
            />
            {entity.attributes.map((attribute, attributeIndex) => (
              <input
                key={attributeIndex}
                type="text"
                value={attribute}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleAttributeChange(
                    entityIndex,
                    attributeIndex,
                    e.target.value
                  )
                }
                placeholder="Attribute Name"
              />
            ))}
            <button type="button" onClick={() => addAttribute(entityIndex)}>
              Add Attribute
            </button>
          </div>
        ))}
        <button type="button" onClick={addEntity}>
          Add Entity
        </button>
        <button type="submit">Generate ERD</button>
      </form>
      {result && (
        <div>
          <h2>SQL Code</h2>
          <pre>{result.sqlCode}</pre>
          <h2>Mermaid Code</h2>
          <pre>{result.mermaidCode}</pre>
        </div>
      )}
    </div>
  );
};

export default DatabaseForm;
