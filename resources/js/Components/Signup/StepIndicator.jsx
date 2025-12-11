export default function StepIndicator({ page }) {
  return (
    <div className="d-flex justify-content-center mb-3 gap-2">
      {[1, 2, 3].map((step) => (
        <span key={step} className={`step-indicator ${page === step ? "active" : ""}`}>
          {step}
        </span>
      ))}
    </div>
  );
}
