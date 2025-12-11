export default function MessageModal({ modalData }) {
  return (
    <div className="terms-modal">
      <div className="terms-content text-center">
        <div className="mb-3">
          {modalData.success ? (
            <i
              className="bi bi-check-circle-fill text-success animate-icon"
              style={{ fontSize: "3rem" }}
            ></i>
          ) : (
            <i
              className="bi bi-x-circle-fill text-danger animate-icon"
              style={{ fontSize: "3rem" }}
            ></i>
          )}
        </div>
        <p>{modalData.message}</p>
      </div>
    </div>
  );
}
