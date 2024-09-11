const Notification = ({ noticationMessage }) => {
    if (noticationMessage === null) {
      return null
    }
    return (
      <div className={noticationMessage.type}>
        {noticationMessage.message}
      </div>
    )
  }

export default Notification