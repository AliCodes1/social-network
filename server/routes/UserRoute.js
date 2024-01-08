const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authenticate=require("../middleware/auth");
const multer=require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Route for updating the user profile
router.post('/updateProfile/:id', authenticate, upload.single('profilePic'), userController.updateProfile);

router.get('/session', userController.checkSession);

router.post("/follow",authenticate,userController.addFollower);

router.delete("/unfollow",authenticate,userController.removeFollower);

router.post('/login', userController.loginUser);

router.post('/logout', userController.logoutUser);

// POST request to register a new user
router.post('/register', userController.registerUser);

// GET request to retrieve all users
router.get('/', userController.getAllUsers);


router.get("/follow/:userId",authenticate,userController.getUserWithFollowData);

// GET request to retrieve a specific user by ID
router.get('/:id', authenticate,userController.getUserById);

// PUT request to update a specific user by ID
router.put('/:id', authenticate, userController.updateUser);

// DELETE request to delete a specific user by ID
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;
