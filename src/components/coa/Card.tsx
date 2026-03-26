import React from "react";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";

type CardProps = {
  index?: number;   // optional now
  title: React.ReactNode; 
  expanded: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
  index,
  title,
  expanded,
  onToggle,
  onDelete,
  children
}) => {
  return (
    <div className="business-card">
      <CardHeader
        index={index}
        title={title}
        expanded={expanded}
        onToggle={onToggle}
        onDelete={onDelete}
      />

      <CardBody expanded={expanded}>
        {children}
      </CardBody>
    </div>
  );
};

export default Card;
