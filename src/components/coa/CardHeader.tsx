import React from "react";

type CardHeaderProps = {
  index: number;
  title: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

const CardHeader: React.FC<CardHeaderProps> = ({
  index,
  title,
  expanded,
  onToggle,
  onDelete
}) => {
  return (
    <div className="business-card-header">
      <div>
        <div className="business-title">{title}</div>
      </div>

      <div className="business-card-actions">
        {/* Expand / Collapse */}
        <button
          type="button"
          className="toggle-button"
          onClick={onToggle}
        >
          {expanded ? "Hide" : "Show"}
        </button>

        {/* Delete (Trash Icon) */}
        <button
          type="button"
          className="remove-button icon-button"
          onClick={onDelete}
          aria-label="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CardHeader;
