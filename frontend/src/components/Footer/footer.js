import "./footer.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const navigate = useNavigate();
  const signInData = useSelector((state) => state.signIn.data);

  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <div className="footer-title"> Đăng ký nhận thông báo </div>
          <div className="footer-items">
            <div> Đăng ký ngay để không bỏ lỡ bất kỳ quyền sách mới nào </div>
            <div className="footer-items-input">
              <input
                className="input-field"
                type="email"
                placeholder="Nhập email của bạn vào đây"
              ></input>
              <div
                className="btn-send"
                style={{
                  fontWeight: "lighter",
                }}
              >
                {" "}
                Đăng ký{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="footer-column">
          <div className="footer-title"> Tài khoản </div>
          <div className="footer-items">
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                if (!signInData.accessToken) {
                  navigate("/signForm");
                } else {
                  toast.warning(`Hãy đăng xuất để có thể truy cập!`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
                }
              }}
            >
              Đăng nhập / Đăng ký
            </div>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/purchaseHistory");
              }}
            >
              {" "}
              Lịch sử mua hàng{" "}
            </div>
          </div>
        </div>

        <div className="footer-column">
          <div className="footer-title">Liên hệ</div>
          <div className="footer-items">
            <div> SĐT: 0336982329 </div>
            <div> Email: booksecommerce2022@gmail.com</div>
            <div> Địa chỉ: 273 An Dương Vương, P.3 , Q.5, TP.HCM</div>
            <div>
              <span className="icon">
                <i className="fa-brands fa-square-facebook"></i>
              </span>
              <span className="icon">
                <i className="fa-brands fa-square-twitter"></i>
              </span>
              <span className="icon">
                <i className="fa-brands fa-linkedin"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
