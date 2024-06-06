import { useState } from "react";
import "../pagestyles/admin.css";
import { MdEdit } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";

const handleDateFormatting = (date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();
  return `${year}-${formattedDay}-${formattedMonth}`;
};

const SlideShowTable = (props) => {
    "use no memo"; // opts out this component from being compiled by React Compiler
    const [slides, setSlides] = useState(props.slideshow);
  
    return (
      <div className="admin-table">
        <div className="admin-table-header">
          <div>Order</div>
          <div>Date</div>
          <div>Title</div>
          <div>Description</div>
          <div>Image</div>
          <div>Background</div>
          <div>Edit</div>
          <div>Delete</div>
        </div>
        <div className="admin-table-body">

              {slides.map((slide, index) => (
                  <div
                    key={`slide-table-row-${index}`}
                    className="admin-table-row"
                  >
                    <div>{index + 1}</div>
                    <div>{handleDateFormatting(new Date(slide.Date))}</div>
                    <div>{slide.Title}</div>
                    <div>{slide.Description}</div>
                    <div>
                      <img src={slide.Image} alt={slide.Title} />
                    </div>
                    <div>
                      <img src={slide.Background} alt={slide.Title} />
                    </div>
                    <div>
                      <button>
                        <MdEdit />
                      </button>
                    </div>
                    <div>
                      <button>
                        <IoCloseCircle color="red" />
                      </button>
                    </div>
                  </div>
              ))}
        </div>
      </div>
    );
  };
  

export default SlideShowTable;
