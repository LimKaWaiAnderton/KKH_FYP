import AddIcon from '@mui/icons-material/Add';

export default function Header({ onOpenModal }) {
  return (
    <header>
      <div className="header-content">
        <h2>Team List</h2>

        <button 
          className="requestBtn"
          onClick={onOpenModal} // display Modal on Click
        >
          Request
          <AddIcon style={{ fontSize: "20px" }} />
        </button>
      </div>
    </header>
  );
}