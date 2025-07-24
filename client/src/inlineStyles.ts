export const toasterStyles = {
  // Default styles for all toasts
  style: {
    background: "#1c1c1c",
    color: "rgba(255, 255, 255, 0.87)",
    border: "2px solid var(--primary-color)",
    borderRadius: "0.75rem",
    padding: "1rem 1.25rem",
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontSize: "0.95rem",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 0, 0, 0.15)",
    backdropFilter: "blur(4px)",
    maxWidth: "400px",
  },
  // Error toast styles
  error: {
    style: {
      background: "linear-gradient(145deg, #1c1c1c, #2a1a1a)",
      border: "2px solid #dc2626",
      boxShadow:
        "0 4px 12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(220, 38, 38, 0.2)",
      color: "#fca5a5",
    },
    iconTheme: {
      primary: "#dc2626",
      secondary: "#1c1c1c",
    },
    duration: 6000,
  },
  // Success toast styles
  success: {
    style: {
      background: "linear-gradient(145deg, #1c1c1c, #1f2a1f)",
      border: "2px solid #22c55e",
      boxShadow:
        "0 4px 12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(34, 197, 94, 0.2)",
      color: "#86efac",
    },
    iconTheme: {
      primary: "#22c55e",
      secondary: "#1c1c1c",
    },
    duration: 4000,
  },
  // Loading toast styles
  loading: {
    style: {
      background: "linear-gradient(145deg, #1c1c1c, #2a2a1c)",
      border: "2px solid var(--secondary-color)",
      boxShadow:
        "0 4px 12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 204, 0, 0.15)",
      color: "#fbbf24",
    },
    iconTheme: {
      primary: "var(--secondary-color)",
      secondary: "#1c1c1c",
    },
  },
};
