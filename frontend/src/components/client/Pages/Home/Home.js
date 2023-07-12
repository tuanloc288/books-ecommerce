import "./home.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toMoney } from "../../../others/utilsAPI";

const Home = () => {
  const [isHover, setIsHover] = useState(0);
  const [botm, setBotm] = useState(0);
  const productsList = useSelector(
    (state) => state.getProducts.cusProductsList
  );
  const categoriesList = useSelector(
    (state) => state.getCategories.categoriesList
  );
  const isLoading = useSelector((state) => state.getProducts.isLoading);
  const navigate = useNavigate();
  const [localList, setLocalList] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      let ele = document.querySelectorAll(".book-effect");
      if (ele.length !== 0) ele[0].classList.add("active");
    }, 500);
    let msg = localStorage.getItem("RedirectMessage");
    if (msg) {
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      localStorage.removeItem("RedirectMessage");
    }
  }, []);

  // useEffect(() => {
  //     if(!isLoading){
  //         handleHover()
  //         renderBookPreview()
  //     }
  // }, [isHover])

  useEffect(() => {
    if (productsList.length !== 0 && localList.length === 0) {
      let i = 0;
      let j = 0;
      let list = [];
      while (i < 9) {
        if (productsList[j].description !== "") {
          list[i] = productsList[j];
          for (let index in categoriesList) {
            if (list[i].category === categoriesList[index].categoryID) {
              list[i] = { ...list[i], category: categoriesList[index].name };
              break;
            }
          }
          ++i;
        }
        ++j;
      }
      setLocalList(list);
    }
  }, [productsList, localList]);

  useEffect(() => {
    if(localList.length !== 0){
        let rmv = document.querySelector(".active");
        if (rmv) rmv.classList.remove("active");
        let ele = document.querySelectorAll(".book-effect");
        if (ele) ele[isHover].classList.add("active");
        let animate = document.querySelector(".book-preview");
        if (animate) {
          animate.style.animation = "bookPreview 0.5s ease-in-out 1";
    
          animate.addEventListener("animationend", () => {
            animate.style.animation = "";
          });
        }
    }
  }, [isHover])

  const decreaseBotm = () => {
    const animate = document.getElementById("sliderAnimation");
    animate.style.animation = "slideFromRtoL 0.5s";
    document.body.classList.add("modal-open");
    botm > 0 ? setBotm(botm - 1) : setBotm(localList.length - 1);

    animate.addEventListener(
      "animationend",
      () => {
        animate.style.animation = "";
        document.body.classList.remove("modal-open");
      },
      { once: true }
    );
  };

  const increaseBotm = () => {
    const animate = document.getElementById("sliderAnimation");
    animate.style.animation = "slideFromLtoR 0.5s";
    botm < 8 ? setBotm(botm + 1) : setBotm(0);

    animate.addEventListener(
      "animationend",
      () => {
        animate.style.animation = "";
      },
      { once: true }
    );
  };

  return (
    <div className="home-container">
      <div className="home-welcome-bg">
        <div className="home-welcome-section">
          <h1 className="home-welcome-text"> Welcome to Bookiverse </h1>
          <h1 className="home-slogan">
            {" "}
            YOU CAN NEVER GET A CUP OF TEA LARGE ENOUGH OR A BOOK LONG ENOUGH TO
            SUIT ME.{" "}
          </h1>
        </div>
      </div>

      <div className="book-featured"> FEATURED BOOKS</div>
      <div className="home-book-preview-section">
        <div className="books-section">
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            localList.map((data, index) => {
              return (
                <Link
                  to={`/products/${data.bookid}`}
                  className="book-item"
                  key={index}
                >
                  <div className="book-effect">
                    <img
                      src={data.image}
                      alt="bookPreview"
                      className="book-image"
                      onMouseEnter={() => {
                        setIsHover(index)
                      }}
                    />
                    <span className="page page1"> </span>
                    <span className="page page2"> </span>
                    <span className="page page3"> </span>
                    <span className="page page4"> </span>
                    <span className="page page5"> </span>
                    <span className="page page6"> </span>
                    <span className="effect effect-top"> </span>
                    <span className="effect effect-bottom"> </span>
                  </div>
                  <div className="book-title"> {data.bookname} </div>
                </Link>
              );
            })
          )}
        </div>
        <div className="book-preview-section">
          {localList.length === 0 ? (
            <div
              className="loader"
              style={{
                marginLeft: 170,
              }}
            ></div>
          ) : (
            <div className="book-preview">
              <div className="book-preview-title">
                {" "}
                {localList[isHover]?.bookname}{" "}
              </div>
              <div className="book-preview-category-section">
                <div className="book-preview-dash"> </div>
                <div className="book-preview-category">
                  {localList[isHover]?.category}
                </div>
              </div>
              <div className="book-preview-detail">
                {localList[isHover]?.description === ""
                  ? "(Hiện sách này không có nội dung)"
                  : localList[isHover]?.description}
              </div>
              <div className="book-preview-price">
                {toMoney(localList[isHover]?.price)}
                <span className="dollar-sign"> đ </span>
              </div>
              <button
                className="book-preview-btn"
                onClick={() => {
                  return navigate(`/products/${localList[isHover]?.bookid}`);
                }}
              >
                Chi tiết
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="book-of-the-month-section">
        <div className="botm-wrapper">
          <i
            className="fa-solid fa-chevron-left arrow"
            onClick={decreaseBotm}
          ></i>
          <div className="botm-content-section" id="sliderAnimation">
            {localList.length === 0 ? (
              <div className="loader"> </div>
            ) : (
              <>
                <div className="botm-left-section" onClick={() => {
                  return navigate(`/products/${localList[botm]?.bookid}`);
                }}>
                  <div className="botm-text"> Books of the month </div>
                  <div className="botm-title">
                    {" "}
                    {localList[botm]?.bookname}{" "}
                  </div>
                  <div className="botm-category">
                    {localList[botm]?.category}
                  </div>
                  <div className="botm-detail">
                    {" "}
                    {localList[botm]?.description}{" "}
                  </div>
                </div>
                <div className="botm-right-section" onClick={() => {
                  return navigate(`/products/${localList[botm]?.bookid}`);
                }}>
                  <img
                    className="botm-image"
                    src={localList[botm]?.image}
                    alt="Botm"
                  />
                  <div className="botm-price">
                    {toMoney(localList[botm]?.price)}
                    <span className="dollar-sign"> đ </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <i
            className="fa-solid fa-chevron-right arrow"
            onClick={increaseBotm}
          ></i>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
