import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsCtrl {
  static async apiGetRestaurants(req, res, next) {
    let q = req.query;
    const perPage = q.restaurantsPerPage ? parseInt(q.restaurantsPerPage) : 20;
    const page = q.page ? parseInt(q.page) : 0;

    let filters = {};
    if (q.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (q.zipcode) {
      filters.zipcode = q.zipcode;
    } else if (q.name) {
      filters.name = q.name;
    }
    const { restaurantsList, totalNumRestaurants } =
      await RestaurantsDAO.getRestaurants({
        filters,
        restaurantsPerPage: perPage,
        page,
      });

    let response = {
      restaurants: restaurantsList,
      page,
      filters,
      entries_per_page: perPage,
      total_results: totalNumRestaurants,
    };

    res.json(response);
  }
}
