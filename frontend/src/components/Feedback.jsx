const Feedback = ({ message }) => {
    if (!message) return null;
  
    const notificationStyle = {
      color: message.type === 'success' ? 'green' : 'red',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
    };
  
    return <div style={notificationStyle}>{message.text}</div>;
  };
  
  export default Feedback;