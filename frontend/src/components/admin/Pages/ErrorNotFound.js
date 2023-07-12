import './management.css'

const ErrorNotFound = () => {
    return (
        <div className="panel-container">
        <div className="panel-title"> Không thể truy cập </div>
        <div className="panel-content" id='noAccess-container'>
        <img src='../../images/noAccess.jpg' alt='no access bg' id='noAccess-img'/>
        </div>
      </div>
    )
}

export default ErrorNotFound