import { Back, notFoundImg } from "assets/images";
import { NOT_FOUND_TITLE } from "constants/title";
import React from "react";
import "./notFound.scss";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";

const NotFound = () => {
  document.title = NOT_FOUND_TITLE;
  const navigate = useNavigate()
  return (
    <div className="notFound">
      <div className="notFound__dialog">
        <figure>
          <img src={notFoundImg} alt="notFoundImg" className="img-fluid" />
        </figure>

        <h3>OOPS! Page Not Found</h3>
        {/* <p>Sorry, the page you're looking for doesn't exists. If you think something is broken,report a problem. </p> */}
        {/* <Link to="/" className="returnLink">Back to dashboard</Link> */}
          <Button
            title="Go Back"
            className="button--blue"
            icon={<Back />}
            onClick={()=>{
              navigate(-1)
            }}
          />
      </div>
    </div>
  );
};

export default NotFound;
