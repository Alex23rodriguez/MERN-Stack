import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import RestaurantDataService from "../services/restaurant.js";

const AddReview = (props) => {
  let editing = false;
  const { id: restId } = useParams();

  let initialReviewState = "";

  let location = useLocation();
  if (location.state && location.state.currentReview) {
    editing = true;
    initialReviewState = location.state.currentReview.text;
  }

  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    var data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: restId,
    };

    if (editing) {
      data.review_id = location.state.currentReview._id;
      RestaurantDataService.updateReview(data)
        .then((response) => {
          setSubmitted(true);
          // console.log(response.data);
        })
        .catch((e) => console.error(e));
    } else {
      RestaurantDataService.createReview(data)
        .then((response) => {
          setSubmitted(true);
          // console.log(response.data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  return (
    <div>
      {props.user ? (
        <div className='submit-form'>
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Link to={"/restaurants/" + restId} className='btn btn-success'>
                Back to Restaurant
              </Link>
            </div>
          ) : (
            <div>
              <div className='form-group'>
                <label htmlFor='description'>
                  {editing ? "Edit" : "Create"} Review
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='text'
                  required
                  value={review}
                  onChange={handleInputChange}
                  name='text'
                />
              </div>
              <button onClick={saveReview} className='btn btn-success'>
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>Please log in.</div>
      )}
    </div>
  );
};

export { AddReview };
