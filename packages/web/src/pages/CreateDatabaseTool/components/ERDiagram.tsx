import React from "react";
import Mermaid from "react-mermaid2";

const ERDiagram: React.FC = () => {
  const mermaidCode = `
    erDiagram
        CUSTOMERS {
            int CustomerID
            varchar FirstName
            varchar LastName
            varchar Email
        }

        ORDERS {
            int OrderID
            date OrderDate
            int CustomerID
        }

        PRODUCTS {
            int ProductID
            varchar ProductName
            decimal Price
        }

        ORDER_DETAILS {
            int OrderDetailID
            int OrderID
            int ProductID
            int Quantity
        }

        SUPPLIERS {
            int SupplierID
            varchar SupplierName
            varchar ContactName
            varchar Country
        }

        PRODUCT_SUPPLIERS {
            int ProductID
            int SupplierID
        }

        EMPLOYEES {
            int EmployeeID
            varchar FirstName
            varchar LastName
            varchar Title
            int ReportsTo
        }

        SHIPPERS {
            int ShipperID
            varchar ShipperName
        }

        SHIPMENTS {
            int ShipmentID
            int OrderID
            int ShipperID
            date ShipmentDate
        }

        CUSTOMERS ||--o{ ORDERS : places
        ORDERS ||--o{ ORDER_DETAILS : contains
        PRODUCTS ||--o{ ORDER_DETAILS : "included in"
        PRODUCTS ||--o{ PRODUCT_SUPPLIERS : "supplied by"
        SUPPLIERS ||--o{ PRODUCT_SUPPLIERS : supplies
        EMPLOYEES ||--o{ EMPLOYEES : "reports to"
        ORDERS ||--|| SHIPMENTS : ships
        SHIPPERS ||--o{ SHIPMENTS : handles
  `;

  return <Mermaid chart={mermaidCode} />;
};

export default ERDiagram;
