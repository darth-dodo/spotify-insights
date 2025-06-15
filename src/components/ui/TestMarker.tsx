
import React from 'react';

export const TestMarker = () => {
  return (
    <div className="hidden" data-testid="changeset-marker">
      {/* This marker indicates the changeset has been applied */}
      Changeset applied - {new Date().toISOString()}
    </div>
  );
};
