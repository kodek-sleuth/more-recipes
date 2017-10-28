import { check } from 'express-validator/check';
// import { sanitize } from 'express-validator/filter';
import { User } from '../models';

export default {
  register: [
    check('firstname')
      .exists()
      .withMessage('First name must be specified')
      .isLength({ min: 1 })
      .withMessage('First name cannot be empty')
      .isLength({ max: 144 })
      .withMessage('First name must not be more than 144 characters')
      .matches(/^[a-z ,.'-\s]+$/i)
      .withMessage('First name can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
    check('lastname')
      .optional({ checkFalsy: true })
      .isLength({ max: 144 })
      .withMessage('Last name must not be more than 144 characters')
      .matches(/^[a-z ,.'-]+$/i)
      .withMessage('Last name can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
    check('username')
      .exists().withMessage('Username must be specified')
      .isLength({ min: 3, max: 144 })
      .withMessage('Username must be between 2 to 144 charcters')
      .matches(/^[a-z0-9]*$/i)
      .withMessage('Username can only contain letters and numbers without space')
      .custom(value => User.findOne({ where: { username: value } }).then((user) => {
        if (user !== null) {
          throw new Error('Username unavailable');
        }

        return true;
      }))
      .trim()
      .escape(),
    check('email')
      .exists().withMessage('Email must be specified')
      .isEmail()
      .withMessage('This email is invalid')
      .custom(value => User.findOne({ where: { email: value } }).then((user) => {
        if (user !== null) {
          throw new Error('This email is already in use');
        }

        return true;
      }))
      .trim()
      .normalizeEmail(),
    check('password')
      .exists().withMessage('Password must be specified')
      .isLength({ min: 10 })
      .withMessage('Password must be at least 10 characters'),
    check('passwordConfirm', 'Passwords don\'t match')
      .exists()
      .custom((value, { req }) => value === req.body.password),
    check('aboutMe')
      .optional({ checkFalsy: true })
      .isLength({ max: 255 }).withMessage('Text must not be more than 255 characters')
      .trim()
      .escape(),
    check('occupation')
      .optional({ checkFalsy: true })
      .matches(/^[a-zA-Z0-9\s]*$/).withMessage('Occupation must be alphanumeric')
      .isLength({ max: 144 })
      .withMessage('Text must not be more than 144 characters')
      .trim()
      .escape(),
    check('profilePic')
      .trim()
      .escape(),
    check('coverPhoto')
      .trim()
      .escape()
  ],
  login: [
    check('email')
      .exists().withMessage('Email must be specified')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .custom(value => User.findOne({ where: { email: value } }).then((user) => {
        if (user === null) {
          throw new Error('This account doesn\'t exist, please Sign Up Instead');
        }

        return true;
      }))
      .trim()
      .normalizeEmail(),
    check('password')
      .exists().withMessage('Password must be specified')
      .isLength({ min: 3 })
      .withMessage('Please enter a valid password.'),
  ],
  addRecipe: [
    check('recipeName')
      .exists()
      .withMessage('Recipe name must be specified')
      .isLength({ min: 1 })
      .withMessage('Recipe name cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Recipe name must not be more than 255 characters')
      .matches(/^[a-z 0-9 ,.'-()\s]+$/i)
      .withMessage('Recipe name can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
    check('prepTime')
      .optional({ checkFalsy: true })
      .isLength({ min: 2, max: 15 })
      .withMessage('Prep time must be between 2 and 15 characters')
      .matches(/^[a-zA-Z0-9\s]*$/)
      .withMessage('Prep time can only contain alphanumeric characters')
      .trim()
      .escape(),
    check('cookTime')
      .optional({ checkFalsy: true })
      .isLength({ min: 2, max: 15 })
      .withMessage('Cook time must be between 2 and 15 characters')
      .matches(/^[a-zA-Z0-9\s]*$/)
      .withMessage('Cook time can only contain alphanumeric characters')
      .trim()
      .escape(),
    check('totalTime')
      .exists()
      .withMessage('Total time must be specified')
      .isLength({ min: 2, max: 15 })
      .withMessage('Total time must be between 2 and 15 characters')
      .matches(/^[a-zA-Z0-9\s]*$/)
      .withMessage('Total time can only contain alphanumeric characters')
      .trim()
      .escape(),
    check('difficulty')
      .optional({ checkFalsy: true })
      .isIn(['Easy', 'Normal', 'A Bit Difficult', 'Difficult', 'Very Difficult'])
      .withMessage('Please select a valid field')
      .trim()
      .escape(),
    check('extraInfo')
      .optional({ checkFalsy: true })
      .matches(/^[a-z 0-9 ,.'-\s]+$/i)
      .withMessage('Extra info can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
    check('vegetarian')
      .optional({ checkFalsy: true })
      .isIn([false, true])
      .withMessage('This field can only accept true or false')
      .trim()
      .escape(),
    check('recipeImage')
      .trim()
      .escape(),
    check('ingredients')
      .exists()
      .withMessage('Ingredient must be specified')
      .isLength({ min: 1 })
      .withMessage('Ingredient cannot be empty')
      .matches(/^[a-z 0-9 ,.'-()\s]+$/i)
      .withMessage('Ingredient can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
    check('preparations')
      .optional({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('Preparation cannot be empty')
      .matches(/^[a-z 0-9 ,.'-()\s]+$/i)
      .withMessage('Preparation can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
    check('directions')
      .exists()
      .withMessage('Direction must be specified')
      .isLength({ min: 1 })
      .withMessage('Direction cannot be empty')
      .matches(/^[a-z 0-9 ,.'-()\s]+$/i)
      .withMessage('Direction can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
  ],
  updateRecipe: [
    check('recipeId')
      .exists()
      .withMessage('Recipe to edit must be specified')
      .isInt()
      .withMessage('Recipe Not Found'),
    check('recipeName')
      .optional({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('Recipe name cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Recipe name must not be more than 255 characters')
      .matches(/^[a-z 0-9 ,.'-()\s]+$/i)
      .withMessage('Recipe name can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
    check('prepTime')
      .optional({ checkFalsy: true })
      .isLength({ min: 2, max: 15 })
      .withMessage('Prep time must be between 2 and 15 characters')
      .matches(/^[a-zA-Z0-9\s]*$/)
      .withMessage('Prep time can only contain alphanumeric characters')
      .trim()
      .escape(),
    check('cookTime')
      .optional({ checkFalsy: true })
      .isLength({ min: 2, max: 15 })
      .withMessage('Cook time must be between 2 and 15 characters')
      .matches(/^[a-zA-Z0-9\s]*$/)
      .withMessage('Cook time can only contain alphanumeric characters')
      .trim()
      .escape(),
    check('totalTime')
      .optional({ checkFalsy: true })
      .isLength({ min: 2, max: 15 })
      .withMessage('Total time must be between 2 and 15 characters')
      .matches(/^[a-zA-Z0-9\s]*$/)
      .withMessage('Total time can only contain alphanumeric characters')
      .trim()
      .escape(),
    check('difficulty')
      .optional({ checkFalsy: true })
      .isIn(['Easy', 'Normal', 'A Bit Difficult', 'Difficult', 'Very Difficult'])
      .withMessage('Please select a valid field')
      .trim()
      .escape(),
    check('extraInfo')
      .optional({ checkFalsy: true })
      .matches(/^[a-z 0-9 ,.'-\s]+$/i)
      .withMessage('Extra info can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
    check('vegetarian')
      .optional({ checkFalsy: true })
      .isIn([false, true])
      .withMessage('This field can only accept true or false')
      .trim()
      .escape(),
    check('recipeImage')
      .trim()
      .escape(),
    check('ingredients')
      .optional({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('Ingredient cannot be empty')
      .matches(/^[a-z 0-9 ,.'-()\s]+$/i)
      .withMessage('Ingredient can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
    check('preparations')
      .optional({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('Preparation cannot be empty')
      .matches(/^[a-z 0-9 ,.'-()\s]+$/i)
      .withMessage('Preparation can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
    check('directions')
      .optional({ checkFalsy: true })
      .isLength({ min: 1 })
      .withMessage('Direction cannot be empty')
      .matches(/^[a-z 0-9 ,.'-()\s]+$/i)
      .withMessage('Direction can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
  ],
  deleteRecipe: [
    check('recipeId')
      .exists()
      .withMessage('Recipe to delete must be specified')
      .isInt()
      .withMessage('Recipe Not Found'),
  ],
  reviewRecipe: [
    check('recipeId')
      .exists()
      .withMessage('Recipe to review must be specified')
      .isInt()
      .withMessage('Recipe Not Found'),
    check('rating')
      .exists()
      .withMessage('Recipe must be rated')
      .isIn(['1', '2', '3', '4', '5'])
      .withMessage('Recipe must be rated from 1 - 5')
      .trim()
      .escape(),
    check('comment')
      .exists()
      .withMessage('Review must be specified')
      .isLength({ min: 1 })
      .withMessage('Review cannot be empty')
      .isLength({ max: 400 })
      .withMessage('Review must not be more than 400 characters')
      .matches(/^[a-z 0-9 ,.'-()\s]+$/i)
      .withMessage('Review can only contain letters and the characters (,.\'-)')
      .trim()
      .escape(),
  ],
  favoriteRecipes: [
    check('userId')
      .exists()
      .withMessage('User must be specified')
      .isInt()
      .withMessage('User Not Found'),
  ],

};
