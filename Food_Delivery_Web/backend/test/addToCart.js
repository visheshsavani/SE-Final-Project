import { expect } from 'chai';
import sinon from 'sinon';
import { addToCart } from '../controllers/cartController.js'; // Assuming addToCart is exported properly from your file
import {userModel} from '../models/userModel.js'; // Mock userModel for database interaction

describe('addToCart.js', () => {
    describe('addToCart', () => {
        let req, res, mockUser;

        beforeEach(() => {
            req = {
                body: {
                    userId: '12345', // Mocked user ID
                    itemId: '67890'  // Mocked item ID to add to cart
                }
            };
            
            res = {
                json: sinon.spy()  // Spy on res.json to check the response
            };

            // Mock user data with cartData
            mockUser = {
                cartData: {}
            };

            // Stub the findById and findByIdAndUpdate methods of userModel
            sinon.stub(userModel, 'findById').returns(Promise.resolve(mockUser));
            sinon.stub(userModel, 'findByIdAndUpdate').returns(Promise.resolve());
        });

        afterEach(() => {
            // Restore the original functions after each test
            sinon.restore();
        });

        it('should add a new item to the cart if item does not exist', async () => {
            await addToCart(req, res);

            expect(mockUser.cartData[req.body.itemId]).to.equal(1); // Check if item added to cart
            expect(userModel.findByIdAndUpdate.calledOnce).to.be.true; // Ensure update was called
            expect(res.json.calledWith({ success: true, message: 'Added To Cart' })).to.be.true; // Check response
        });

        it('should increment the item quantity if item already exists in the cart', async () => {
            mockUser.cartData[req.body.itemId] = 2; // Mock existing item in the cart

            await addToCart(req, res);

            expect(mockUser.cartData[req.body.itemId]).to.equal(3); // Check if item quantity incremented
            expect(userModel.findByIdAndUpdate.calledOnce).to.be.true; // Ensure update was called
            expect(res.json.calledWith({ success: true, message: 'Added To Cart' })).to.be.true; // Check response
        });

        it('should handle errors and return failure message', async () => {
            // Force an error by rejecting the findById method
            userModel.findById.rejects(new Error('Database error'));

            await addToCart(req, res);

            expect(res.json.calledWith({ success: false, message: 'Failed to add to cart' })).to.be.true; // Check error response
        });
    });
});