import { Recipe, Favorite, User } from '../models';
import getItems from '../helpers/getItems';
import getRecipe from '../helpers/getRecipe';

export default {
  addFavoriteRecipe: (req, favoriteData, res, next) => Favorite.findOne({
    where: {
      recipeId: +favoriteData.recipeId,
      userId: req.id
    }
  })
    .then((favorited) => {
      if (favorited) {
        return favorited.destroy().then(() => getRecipe(req.id, +favoriteData.recipeId)
          .then(responseObject => res.status(200).send({
            message: 'Recipe has been removed from favorites',
            recipe: responseObject
          })))
          .catch(next);
      }

      return Favorite
        .create({
          favorite: true,
          recipeId: +favoriteData.recipeId,
          userId: req.id
        })
        .then(() => getRecipe(req.id, +favoriteData.recipeId)
          .then(responseObject => res.status(201).send({
            message: 'Recipe has been added to favorites',
            recipe: responseObject
          })))
        .catch(next);
    })
    .catch(next),

  getFavorites: (req, favoriteRecipeData, res, next) => {
    if (+req.id !== +req.params.userId) {
      return res.status(401).send({ message: 'You are not authorized to access this page' });
    }

    return Recipe.findAll({
      include: [{
        model: Favorite,
        as: 'favorites',
        attributes: [],
        where: {
          userId: +favoriteRecipeData.userId,
        }
      },
      {
        model: User,
        as: 'User',
        attributes: ['id', 'username', 'profilePic']
      }],
      group: ['Recipe.id', 'User.id']
    })
      .then(recipes => getItems(req, res, recipes, 'recipes'))
      .catch(next);
  }
};
