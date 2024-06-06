import { useState } from 'react';
import '../pagestyles/admin.css';
import { MdEdit } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";

const uploadImage = async (file, id) => {
  try {
      const result = await uploadData({
        path: `public/images/${show.RtsCode}/poster.png`,
        data: file,
      }).result;
      console.log("Uploaded slideshow image");
  } catch (error) {
    console.log('Error uploading slideshow image: ', error);
  }
};

const handleDisplayDate = (date) => {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return `${month}-${day}-${year}`;
};



function UpcomingShows(props) {
    const shows = props.upcomingShows
    const addToSlideshow = props.addToSlideshow
    const [showEdit, setShowEdit] = useState(false)
    const [showIndex, setShowIndex] = useState(0)

    const handleShowEdit = (index) => {
      setShowEdit(!showEdit)
      setShowIndex(index)
      console.log(index)
    }

    const addImage = (show) => {
      const fileInput = document.getElementById('fileInput');
      fileInput.click();
      fileInput.onchange = () => {
        const file = fileInput.files[0];
        uploadImage(file, show.RtsCode);
      };
    };

    const handleAddShow = (show) => {
      addToSlideshow(show)
    }



    return (
        <div className="admin-table-container">
            <h2>Upcoming Shows</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Start Date</th>
                <th scope="col">RtsCode</th>
                <th scope="col">Poster</th>
                <th scope="col">Add To Slideshow</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show, index) => (
                <tr key={index}>
                  <td>{show.name}</td>
                  <td>{handleDisplayDate(show.StartDate)}</td>
                  <td>{show.RtsCode}</td>
                  <td><img src={`https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/public/images/${show.RtsCode}/poster.png`} alt="Poster Missing" /></td>
                  <td><button onClick={() => handleAddShow(show)}><FaPlusCircle /></button></td>
                  <td><button onClick={() => handleShowEdit(index)}><MdEdit /></button></td>
                </tr>
              ))}
            </tbody>
          </table>

            {showEdit && (
              <div className="admin-edit-show-background">
                <button className='close-button' onClick={() => handleShowEdit()}>Close</button>
              <div className='admin-edit-show'>
                <h3>{shows[showIndex].Name}</h3>
                <form>
                <input type="file" />
                <button type="submit" onClick={() => addImage(shows[showIndex])}>Add Poster</button>
                </form>
              </div>
              </div>
            )}

        </div>
    );
}

export default UpcomingShows;
