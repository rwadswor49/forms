import React from "react";

type CardBodyProps = {
  expanded: boolean;
  children: React.ReactNode;
};

const CardBody: React.FC<CardBodyProps> = ({ expanded, children }) => {
  if (!expanded) return null;

  return (
    <div className="business-card-body">
      {children}
    </div>
  );
};

export default CardBody;
