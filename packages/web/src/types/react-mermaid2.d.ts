declare module "react-mermaid2" {
  import { ComponentType } from "react";

  interface MermaidProps {
    chart: string;
    config?: object;
  }

  const Mermaid: ComponentType<MermaidProps>;
  export default Mermaid;
}
