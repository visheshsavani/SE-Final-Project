import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { registerUser } from '../controllers/userController.js';
import { userModel } from '../models/userModel.js';

// Mock functions for bcrypt, validator, and userModel
describe('registerUser', () => {
  let req, res;

  beforeEach(() => {
    // Mocking the request and response objects
    req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    };

    res = {
      json: sinon.spy(),  // Use sinon to spy on json function to check calls
    };
  });

  afterEach(() => {
    sinon.restore(); // Clean up after each test to remove spies
  });

  it('should register a new user successfully', async () => {
    // Mocking database call: userModel.findOne should return null (no user found)
    sinon.stub(userModel, 'findOne').resolves(null);  

    // Mocking bcrypt functions
    sinon.stub(bcrypt, 'genSalt').resolves('salt');  // Mock the bcrypt.genSalt
    sinon.stub(bcrypt, 'hash').resolves('hashedPassword'); // Mock bcrypt.hash
    
    // Mock the save method for the user model
    sinon.stub(userModel.prototype, 'save').resolves({
      _id: '12345',
      email: 'john@example.com',
    });

    // Act: Call the registerUser function with mock request and response
    await registerUser(req, res);

    // Assert: Check that res.json was called with correct values
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.calledWithMatch({ success: true })).to.be.true;
    expect(res.json.calledWithMatch({ token: sinon.match.string })).to.be.true;  // Ensure token is returned
  });

  it('should return an error if user already exists', async () => {
    // Mocking database call: userModel.findOne should return an existing user
    sinon.stub(userModel, 'findOne').resolves({ email: 'john@example.com' });

    // Act: Call the registerUser function with mock request and response
    await registerUser(req, res);

    // Assert: Check if the correct response was returned
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.calledWithMatch({ success: false, message: 'User already exists' })).to.be.true;
  });

  it('should return an error if email is invalid', async () => {
    // Arrange: Set an invalid email in the request
    req.body.email = 'invalid-email';

    // Act: Call the registerUser function
    await registerUser(req, res);

    // Assert: Check if the correct error message was returned
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.calledWithMatch({ success: false, message: 'Please enter a valid Email' })).to.be.true;
  });

  it('should return an error if password is too short', async () => {
    // Arrange: Set a short password
    req.body.password = 'short';

    // Act: Call the registerUser function
    await registerUser(req, res);

    // Assert: Check if the correct error message was returned
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.calledWithMatch({ success: false, message: 'Please enter a strong password' })).to.be.true;
  });

  it('should return an error if there is an exception', async () => {
    // Mock the findOne method to throw an error
    sinon.stub(userModel, 'findOne').rejects(new Error('Database error'));

    // Act: Call the registerUser function
    await registerUser(req, res);

    // Assert: Check if the error response is returned
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.calledWithMatch({ success: false, message: 'Error' })).to.be.true;
  });
});
