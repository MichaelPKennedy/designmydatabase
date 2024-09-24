import React from "react";
import MermaidDiagram from "./MermaidDiagram";

interface ERDiagramProps {
  result: {
    mermaidCode: string;
    sqlCode: string;
  };
}

const ERDiagram: React.FC<ERDiagramProps> = ({ result }) => {
  const handleDownloadSQL = () => {
    const blob = new Blob([result.sqlCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "database_schema.sql";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Entity Relationship Diagram</h2>
      <MermaidDiagram chartDefinition={result.mermaidCode} />
      <button className="download-sql-button" onClick={handleDownloadSQL}>
        Download SQL
      </button>
    </div>
  );
};

export default ERDiagram;
