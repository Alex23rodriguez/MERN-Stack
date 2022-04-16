import { ObjectId } from "mongodb";

let restaurants;
export default class RestaurantsDAO {
  static async injectDB(conn) {
    if (restaurants) return;
    try {
      restaurants = conn.db(process.env.DB_NAMESPACE).collection("restaurants");
      // to test if properly connected:
      // console.log(await restaurants.findOne());
    } catch (e) {
      console.error(
        `Unable to establich a collection handle in restaurantsDAO: ${e}`
      );
    }
  }

  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      } else if ("cuisine" in filters) {
        query = { cuisine: { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }
    let cursor;
    try {
      cursor = await restaurants.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
    const displayCursor = cursor
      .limit(restaurantsPerPage)
      .skip(restaurantsPerPage * page);

    try {
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query); // slow if many
      // const totalNumRestaurants = await restaurants.estimatedDocumentCount(query); // fast

      return { restaurantsList, totalNumRestaurants };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }

  static async getRestaurantById(id) {
    try {
      console.log(id);
      const pipeline = [
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "reviews",
            let: { id: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$restaurant_id", "$$id"] } } },
              { $sort: { date: -1 } },
            ],
            as: "reviews",
          },
        },
        {
          $addFields: { reviews: "$reviews" },
        },
      ];

      return await restaurants.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getRestaurantById: ${e}`);
      return { error: e };
    }
  }

  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await restaurants.distinct("cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines: ${e}`);
      return cuisines;
    }
  }
}
