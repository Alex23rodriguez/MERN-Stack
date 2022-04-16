import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RestaurantDataService from "../services/restaurant.js";

const Restaurant = (props) => {
  const { id: restId } = useParams();
  const initialRestaurantState = {
    _id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: [],
  };

  const [restaurant, setRestaurant] = useState(initialRestaurantState);

  const getRestaurant = (id) => {
    RestaurantDataService.get(id)
      .then((response) => {
        console.log(response.data);
        setRestaurant(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    console.log(props);
    getRestaurant(restId);
  }, [restId]);

  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, props.user.id)
      .then((response) => {
        setRestaurant((prevState) => {
          prevState.reviews.splice(index, 1);
          return {
            ...prevState,
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {restaurant._id ? (
        <div>
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>
            {restaurant.cuisine}
            <br />
            <strong>Address: </strong>
            {restaurant.address.building} {restaurant.address.street},{" "}
            {restaurant.address.zipcode}
          </p>
          <Link
            to={"/restaurants/" + restId + "/review"}
            className='btn btn-primary'
          >
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className='row'>
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => {
                return (
                  <div className='col-lg-4 pb-1' key={index}>
                    <div className='card'>
                      <div className='card-body'>
                        <p className='card-text'>
                          {review.text}
                          <br />
                          <strong>User: </strong>
                          {review.name}
                          <br />
                          <strong>Date: </strong>
                          {review.date}
                        </p>
                        {props.user && props.user.id === review.user_id && (
                          <div className='row'>
                            <a
                              onClick={() => deleteReview(review._id, index)}
                              className='btn btn-primary col-lg-5 mx-1 mb-1'
                            >
                              Delete
                            </a>
                            <Link
                              to={{
                                pathname: "/restaurants/" + restId + "/review",
                                state: {
                                  currentReview: review,
                                },
                              }}
                              className='btn btn-primary col-lg-5 mx-1 mb-1'
                            >
                              Edit
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className='col-sm-4'>
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {console.log(`restaurant: ${Object.keys(restaurant)}`)}
          <br />
          <p>Restaurant not found</p>
        </div>
      )}
    </div>
  );
};

export { Restaurant };
