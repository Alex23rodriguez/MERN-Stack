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

  static async apiGetRestaurantsById(req, res, next) {
    try {
      let id = req.params.id || {};
      let restaurant = await RestaurantsDAO.getRestaurantById(id);
      if (!restaurant) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      res.json(restaurant);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetRestaurantsCuisines(req, res, next) {
    try {
      let cuisines = await RestaurantsDAO.getCuisines();
      res.json(cuisines);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
