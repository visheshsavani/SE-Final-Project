
import { expect } from 'chai';
import sinon from 'sinon';
import { updateFood } from '../controllers/foodController.js'; // Assuming the file structure
import {foodModel} from '../models/foodModel.js';
import fs from 'fs';

describe('updateFood', () => {

  let req, res, foodStub, unlinkStub;

  beforeEach(() => {
    req = {
      params: { id: '123' },
      body: { name: 'Pizza', description: 'Delicious', price: 15, category: 'Fast Food' },
      file: null // No image file initially
    };
    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };
    foodStub = sinon.stub(foodModel, 'findById');
    unlinkStub = sinon.stub(fs, 'unlinkSync');
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs/mocks after each test
  });

  it('should update food without image', async () => {
    const updatedFood = { _id: '123', name: 'Pizza', description: 'Delicious', price: 15, category: 'Fast Food' };
    const findByIdAndUpdateStub = sinon.stub(foodModel, 'findByIdAndUpdate').resolves(updatedFood);

    await updateFood(req, res);

    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(res.json.calledWith({ success: true, message: 'Food updated successfully', food: updatedFood })).to.be.true;
  });

  it('should update food with a new image and delete old image', async () => {
    req.file = { filename: 'newImage.jpg' }; // Simulating a new image upload

    const existingFood = { _id: '123', image: 'oldImage.jpg' }; // Food with an old image
    foodStub.resolves(existingFood);

    const updatedFood = { _id: '123', name: 'Pizza', description: 'Delicious', price: 15, category: 'Fast Food', image: 'newImage.jpg' };
    const findByIdAndUpdateStub = sinon.stub(foodModel, 'findByIdAndUpdate').resolves(updatedFood);

    await updateFood(req, res);

    expect(unlinkStub.calledWith('uploads/oldImage.jpg')).to.be.true; // Check old image deletion
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(res.json.calledWith({ success: true, message: 'Food updated successfully', food: updatedFood })).to.be.true;
  });

  it('should return 404 if food is not found', async () => {
    const findByIdAndUpdateStub = sinon.stub(foodModel, 'findByIdAndUpdate').resolves(null); // Simulate no food found

    await updateFood(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ success: false, message: 'Food not found' })).to.be.true;
  });

  it('should return 500 if an error occurs during update', async () => {
    const findByIdAndUpdateStub = sinon.stub(foodModel, 'findByIdAndUpdate').throws(new Error('Update error'));

    await updateFood(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ success: false, message: 'Error updating food' })).to.be.true;
  });

  it('should return 500 if an error occurs while deleting the old image', async () => {
    req.file = { filename: 'newImage.jpg' }; // Simulating a new image upload
    const existingFood = { _id: '123', image: 'oldImage.jpg' }; // Food with an old image
    foodStub.resolves(existingFood);

    unlinkStub.throws(new Error('File deletion error')); // Simulate file deletion error

    await updateFood(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ success: false, message: 'Error updating food' })).to.be.true;
  });
});
