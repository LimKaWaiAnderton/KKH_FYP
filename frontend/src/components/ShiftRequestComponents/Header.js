import "../../styles/ShiftRequest/Header.css";

export default function Header({ onAddShift }) {
    return (
        <header className="header">
            <h1>Shift Request</h1>

            <button className="request-btn" onClick={onAddShift}>
                Request +
            </button>
        </header>
    );
}
