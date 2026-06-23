import React, { useEffect, useState } from "react";

const CookingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenWelcomeModal");
    if (!hasSeen) {
      setIsOpen(true);
      localStorage.setItem("hasSeenWelcomeModal", "true");
    }
  }, []);

  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div
          style={overlayStyle}
          onClick={closeModal}
        >
          <div
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={closeButtonStyle} onClick={closeModal}>
              ×
            </button>

            <h2 style={{ marginBottom: "1rem" }}>
              🚧 Pardon the Pixels
            </h2>

            <p style={{ marginBottom: "1rem", lineHeight: 1.6 }}>
              I’m still tweaking a few things around here.
              If something looks weird, shifts oddly, or does
              a little dance it shouldn’t… I probably know 😅
            </p>

            <p style={{ marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Feel free to explore anyway — and thanks for stopping by.
            </p>

            <button style={ctaStyle} onClick={closeModal}>
              Got it 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookingModal;

/* ------------------ Styles ------------------ */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  animation: "fadeIn 0.3s ease"
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "2rem",
  borderRadius: "12px",
  maxWidth: "500px",
  width: "90%",
  position: "relative",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  animation: "slideUp 0.3s ease"
};

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "12px",
  right: "16px",
  border: "none",
  background: "none",
  fontSize: "1.5rem",
  cursor: "pointer"
};

const ctaStyle: React.CSSProperties = {
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  background: "#111",
  color: "#fff",
  cursor: "pointer"
};

/* Inject animations into document */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0 }
      to { opacity: 1 }
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0 }
      to { transform: translateY(0); opacity: 1 }
    }
  `;
  document.head.appendChild(style);
}
