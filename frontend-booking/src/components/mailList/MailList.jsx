import "./MailList.css"

const MailList = () => {
  return (
    <div className="mail">
      <h1 className="mailTitle">Sign up!</h1>
      <span className="mailDesc">Sign up to get notified for the best deals!</span>
      <div className="mailInputContainer">
        <input type="text" placeholder="Your Email"/>
        <button>Subscribe</button>
      </div>
    </div>
  )
}

export default MailList