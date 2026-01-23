import AddIcon from '@mui/icons-material/Add';

export default function HeaderWithAddBtn({ onOpenModal, title, btnText }) {
  return (
    <header>
      <div className="header-content">
        <h2>{title}</h2>
        <button 
          className="requestBtn"
          onClick={onOpenModal}
        >
          {btnText}
          <AddIcon style={{ fontSize: "20px" }} />
        </button>
      </div>
    </header>
  );
}
