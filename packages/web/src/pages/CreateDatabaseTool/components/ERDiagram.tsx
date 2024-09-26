import React, { useEffect, useState } from "react";
import MermaidDiagram from "./MermaidDiagram";
import mermaid from "mermaid";
import styled from "styled-components";

interface ERDiagramProps {
  result: {
    mermaidCode: string;
    sqlCode: string;
  };
}

const DiagramContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const DownloadButton = styled.button``;

const ERDiagram: React.FC<ERDiagramProps> = ({ result }) => {
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
  }, []);

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

  const handleDownloadERD = async () => {
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "erd_diagram.png";
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const handleSvgRendered = (
    svg: SVGSVGElement | null,
    error: Error | null
  ) => {
    if (error) {
      setError(error.message);
      setSvgElement(null);
    } else {
      setError(null);
      setSvgElement(svg);
    }
  };

  return (
    <div>
      <h2>Entity Relationship Diagram</h2>
      {error ? (
        <div className="error-message">
          <p>Error rendering diagram:</p>
          <pre>{error}</pre>
        </div>
      ) : (
        <DiagramContainer>
          <MermaidDiagram
            chartDefinition={result.mermaidCode}
            onSvgRendered={handleSvgRendered}
          />
        </DiagramContainer>
      )}
      <ButtonContainer>
        <DownloadButton onClick={handleDownloadSQL}>
          Download SQL
        </DownloadButton>
        <DownloadButton onClick={handleDownloadERD} disabled={!svgElement}>
          Download ERD
        </DownloadButton>
      </ButtonContainer>
    </div>
  );
};

export default ERDiagram;
