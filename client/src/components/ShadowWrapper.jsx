// src/components/ShadowWrapper.jsx
import React from "react";
import reactShadow from "react-shadow";

const ShadowWrapper = ({ children, styles = "" }) => {
  return (
    <reactShadow.div>
      <style>{styles}</style>
      {children}
    </reactShadow.div>
  );
};

export default ShadowWrapper;
