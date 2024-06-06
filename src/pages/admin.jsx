import React, { useState, useEffect } from "react";
import "../pagestyles/admin.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";
import { remove } from "aws-amplify/storage";
import "@aws-amplify/ui-react/styles.css";
import { MdEdit } from "react-icons/md";
import CurrentShows from "../admincomponents/currentShows";
import UpcomingShows from "../admincomponents/upcomingShows";
import { IoCloseCircle } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const handleDateFormatting = (date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();
  return `${year}-${formattedDay}-${formattedMonth}`;
};

const uploadImage = async (file, id) => {
  try {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result;
      await uploadData({
        path: `public/slideshow/images/image-${id}.png`,
        data: result,
        contentType: file.type,
      });
      console.log("Uploaded slideshow image");
    };
    reader.readAsArrayBuffer(file);
  } catch (error) {
    console.log("Error uploading slideshow image: ", error);
  }
};

const uploadBackground = async (file, id) => {
  try {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result;
      await uploadData({
        path: `public/slideshow/backgrounds/background-${id}.png`,
        data: result,
        contentType: file.type,
      });
      console.log("Uploaded slideshow background");
    };
    reader.readAsArrayBuffer(file);
  } catch (error) {
    console.log("Error uploading slideshow background: ", error);
  }
};

function AddSlideshow({ addSlideshow, length }) {
  const [newSlideshow, setNewSlideshow] = useState({
    Date: "",
    Title: "",
    Description: "",
    Image: "",
    Background: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = length;

    if (newSlideshow.Image) {
      await uploadImage(newSlideshow.Image, id);
      newSlideshow.Image = `https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/slideshow/images/image-${id}.png`;
    }
    if (newSlideshow.Background) {
      await uploadBackground(newSlideshow.Background, id);
      newSlideshow.Background = `https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/slideshow/backgrounds/background-${id}.png`;
    }

    addSlideshow(newSlideshow);
  };

  return (
    <div className="add-edit-announcement-container">
      <h3>Add Slideshow</h3>
      <form onSubmit={handleSubmit}>
        <span className="in-line">
          <label htmlFor="date">Date:</label>
          <input
            className="date-input"
            type="date"
            id="date"
            name="date"
            value={newSlideshow.Date}
            onChange={(e) =>
              setNewSlideshow({ ...newSlideshow, Date: e.target.value })
            }
          />
        </span>
        <span className="in-line">
          <label htmlFor="title">Title:</label>
          <input
            className="title-input"
            type="text"
            id="title"
            name="title"
            value={newSlideshow.Title}
            onChange={(e) =>
              setNewSlideshow({ ...newSlideshow, Title: e.target.value })
            }
          />
        </span>
        <span className="in-line">
          <textarea
            className="description-input"
            id="description"
            name="description"
            value={newSlideshow.Description}
            onChange={(e) =>
              setNewSlideshow({ ...newSlideshow, Description: e.target.value })
            }
          />
        </span>
        <span className="in-line">
          <label htmlFor="image">Image:</label>
          <input
            className="file-input"
            type="file"
            id="image"
            name="image"
            onChange={(e) =>
              setNewSlideshow({ ...newSlideshow, Image: e.target.files[0] })
            }
          />
        </span>
        <span className="in-line">
          <label htmlFor="background">Background:</label>
          <input
            className="file-input"
            type="file"
            id="background"
            name="background"
            onChange={(e) =>
              setNewSlideshow({
                ...newSlideshow,
                Background: e.target.files[0],
              })
            }
          />
        </span>
        <button type="submit">Add Announcement</button>
      </form>
    </div>
  );
}

function EditSlideshow({ slideshow, index, updateSlideshow }) {
  const [editedSlideshow, setEditedSlideshow] = useState(slideshow[index]);
  const [uploadedNewImage, setUploadedNewImage] = useState(false);
  const [uploadedNewBackground, setUploadedNewBackground] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = index;
    let newImageURL = editedSlideshow.Image;
    let newBackgroundURL = editedSlideshow.Background;

    if (uploadedNewImage) {
      await uploadImage(editedSlideshow.Image, id);
      newImageURL = `https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/slideshow/images/image-${id}.png`;
    }

    if (uploadedNewBackground) {
      await uploadBackground(editedSlideshow.Background, id);
      newBackgroundURL = `https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/slideshow/backgrounds/background-${id}.png`;
    }

    const updatedSlideshow = {
      ...editedSlideshow,
      Image: newImageURL,
      Background: newBackgroundURL,
    };

    updateSlideshow(updatedSlideshow, index);
  };

  const handleImageChange = (e) => {
    setEditedSlideshow({ ...editedSlideshow, Image: e.target.files[0] });
    setUploadedNewImage(true);
  };

  const handleBackgroundChange = (e) => {
    setEditedSlideshow({ ...editedSlideshow, Background: e.target.files[0] });
    setUploadedNewBackground(true);
  };

  return (
    <div className="add-edit-announcement-container">
      <h3>Edit Announcement</h3>
      <form onSubmit={handleSubmit}>
        <span className="in-line">
          <label htmlFor="date">Date:</label>
          <input
            className="date-input"
            type="date"
            id="date"
            name="date"
            value={editedSlideshow.Date}
            onChange={(e) =>
              setEditedSlideshow({ ...editedSlideshow, Date: e.target.value })
            }
          />
        </span>
        <span className="in-line">
          <label htmlFor="title">Title:</label>
          <input
            className="title-input"
            type="text"
            id="title"
            name="title"
            value={editedSlideshow.Title}
            onChange={(e) =>
              setEditedSlideshow({ ...editedSlideshow, Title: e.target.value })
            }
          />
        </span>
        <span className="in-line">
          <textarea
            className="description-input"
            id="description"
            name="description"
            value={editedSlideshow.Description}
            onChange={(e) =>
              setEditedSlideshow({
                ...editedSlideshow,
                Description: e.target.value,
              })
            }
          />
        </span>
        <span className="in-line">
          <label htmlFor="image">Image:</label>
          <input
            className="file-input"
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
        </span>
        <span className="in-line">
          <label htmlFor="background">Background:</label>
          <input
            className="file-input"
            type="file"
            id="background"
            name="background"
            onChange={handleBackgroundChange}
          />
        </span>
        <button className="submit-button" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}

function Admin(props) {
  const {
    signOut,
    user,
    slideshow: initialSlideshow,
    currentShows,
    upcomingShows,
  } = props;
  const [slideshow, setSlideshow] = useState(initialSlideshow);
  const [addNewSlideshow, setAddNewSlideshow] = useState(false);
  const [editSlideshow, setEditSlideshow] = useState(null);
  const [deleteSlideshow, setDeleteSlideshow] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(false);

  const convertToJSON = (slideshow) => {
    return JSON.stringify(slideshow);
  };

  const uploadSlideshow = async (slideshow) => {
    try {
      await uploadData({
        path: "public/slideshow/slideshow.json",
        data: convertToJSON(slideshow),
      }).result;
      console.log("Uploaded slideshow");
      setUploadStatus(true);
      setUploadSuccess(true);
      setUploadError(false);
    } catch (error) {
      console.log("Error uploading slideshow: ", error);
      setUploadStatus(true);
      setUploadSuccess(false);
      setUploadError(true);
    }
  };

  const handleDeleteImage = async (index) => {
    try {
      await remove({
        path: `public/slideshow/images/image-${index}.png`,
      });
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const handleDeleteBackground = async (index) => {
    try {
      await remove({
        path: `public/slideshow/backgrounds/background-${index}.png`,
      });
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const handleDeleteSlideshow = (index) => {
    const newSlideshow = slideshow.filter((_, i) => i !== index);
    handleDeleteImage(index);
    handleDeleteBackground(index);
    setSlideshow(newSlideshow);
    uploadSlideshow(newSlideshow);
  };

  const handleAddCurrShowToSlideshow = (show) => {
    const newCurrSlide = {
      Date: show.StartDate,
      Title: show.name,
      Description: "Now Playing!",
      Image: show.poster,
      Background: show.poster,
    };

    setSlideshow([...slideshow, newCurrSlide]);
    uploadSlideshow([...slideshow, newCurrSlide]);
  };

  const handleAddUpShowToSlideshow = (show) => {
    const newCurrSlide = {
      Date: show.StartDate,
      Title: show.name,
      Description: "Coming Soon!",
      Image: show.poster,
      Background: show.poster,
    };

    setSlideshow([...slideshow, newCurrSlide]);
    uploadSlideshow([...slideshow, newCurrSlide]);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(slideshow);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSlideshow(items);
    uploadSlideshow(items);
  };

  useEffect(() => {
    setTimeout(() => {
      setUploadStatus(false);
      setUploadError(false);
      setUploadSuccess(false);
    }, 3000);
  }, [uploadStatus]);

  return (
    <div className="page-container">
      <div className="admin-console">
        <span className="admin-console-header">
          <h2>Hello {user.username}</h2>
          <button className="sign-out-button" onClick={signOut}>
            Sign out
          </button>
        </span>
        <motion.div
          className="upload-status"
          initial={{ opacity: 0 }}
          animate={{ opacity: uploadStatus ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          {uploadError && (
            <span className="upload-status-content">
              <FaCheckCircle color="red" />
              <p>Upload Failed</p>
            </span>
          )}
          {uploadSuccess && (
            <span className="upload-status-content">
              <FaCheckCircle color="green" />
              <p>Upload Successful</p>
            </span>
          )}
        </motion.div>
        {addNewSlideshow && (
          <AddSlideshow
            length={slideshow.length}
            addSlideshow={(newSlideshow) => {
              setSlideshow([...slideshow, newSlideshow]);
              uploadSlideshow([...slideshow, newSlideshow]);
              setAddNewSlideshow(false);
            }}
          />
        )}
        {editSlideshow !== null && (
          <EditSlideshow
            slideshow={slideshow}
            index={editSlideshow}
            updateSlideshow={(updatedSlideshow, index) => {
              setSlideshow(
                slideshow.map((slideshow, i) =>
                  i === index ? updatedSlideshow : slideshow
                )
              );
              uploadSlideshow(
                slideshow.map((slideshow, i) =>
                  i === index ? updatedSlideshow : slideshow
                )
              );
              setEditSlideshow(null);
            }}
          />
        )}
        <button
          className="add-slideshow-button"
          onClick={() => setAddNewSlideshow(!addNewSlideshow)}
        >
          Add Slideshow Slide
        </button>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="slideshow">
            {(provided) => (
              <div
                className="admin-table-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
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
                    {slideshow.map((slide, index) => (
                      <Draggable
                        key={`slide-${index}`}
                        draggableId={`slide-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="admin-table-row"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div>{index + 1}</div>
                            <div>
                              {handleDateFormatting(new Date(slide.Date))}
                            </div>
                            <div>{slide.Title}</div>
                            <div>{slide.Description}</div>
                            <div>
                              <img src={slide.Image} alt={slide.Title} />
                            </div>
                            <div>
                              <img src={slide.Background} alt={slide.Title} />
                            </div>
                            <div>
                              <button onClick={() => setEditSlideshow(index)}>
                                <MdEdit />
                              </button>
                            </div>
                            <div>
                              <button
                                onClick={() => handleDeleteSlideshow(index)}
                              >
                                <IoCloseCircle color="red" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <CurrentShows
        addToSlideshow={handleAddCurrShowToSlideshow}
        currentShows={currentShows}
      />
      <UpcomingShows
        addToSlideshow={handleAddUpShowToSlideshow}
        upcomingShows={upcomingShows}
      />
    </div>
  );
}

export default function AdminWithAuth(props) {
  return (
    <Authenticator className="sign-in" hideSignUp={true}>
      {({ signOut, user }) => (
        <Admin
          currentShows={props.currentShows}
          slideshow={props.slideshow}
          upcomingShows={props.upcomingShows}
          signOut={signOut}
          user={user}
        />
      )}
    </Authenticator>
  );
}
