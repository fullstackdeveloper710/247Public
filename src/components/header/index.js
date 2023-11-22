import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UploadIcon, Mobilemenu, MainLogo } from "assets/images";
import "./header.scss";
import { ROUTES } from "routes/constant";
const Header = React.forwardRef(({ title, setIsToggle, isToggle,isSubscribed }, ref) => {
  const navigate = useNavigate()
  return (
    <div className="mainheaderOuter">
      {/* <div className='mobileHeader d-none'>
        <Row className='align-items-center'>
          <Col xs={10} md={6}>
            <Link to="/" className='sideBar-Logo'  >
              <img src={MainLogo} alt='247 Accessible Documents Logo' className='img-fluid logo-desktop' />
            </Link> 
          </Col>
          <Col xs={2} md={6}>
            <button aria-haspopup="menu" aria-label="open navigation" className={`mobileToggle d-none ${isToggle ? 'menuClose' : 'menuOpen'}`} onClick={() => { setIsToggle(!isToggle) }} >
              <Mobilemenu className='menu-bar' role="img" />
            </button>
          </Col>
        </Row>
      </div> */}
      <div className="dashBoardHeaderwrapper">
        <div className="dashBoardHeader">
          <Row className="align-items-center">
            <Col sm={6} md={6}>
              <h1 className="mainTitle" ref={ref} tabIndex="-1">
                {title}
              </h1>
            </Col>
            {isSubscribed&&<Col sm={6} md={6}>
              <div className="dashBoardHeader-btn">
                <button
                  onClick={()=>{
                    navigate(ROUTES.UPDATE)
                  }}
                  type="button"
                  className="btn btn--md button--blue ms-auto"
                >
                  <UploadIcon aria-hidden="true" focusable="false" /> Upload
                </button>
              </div>
            </Col>}
          </Row>
        </div>
      </div>
    </div>
  );
});

export default Header;
